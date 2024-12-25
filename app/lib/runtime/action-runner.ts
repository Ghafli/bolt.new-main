import { Action } from "@/app/types/actions";
import { TerminalStore } from "../stores/terminal";
import { WebContainer } from "@webcontainer/api";
import { FilesStore } from "../stores/files";
import { ChatStore } from "../stores/chat";
import { Message } from "@/app/types/chat";
import { stripIndent } from "@/app/utils/stripIndent";
import { isBinary } from "istextorbinary";
import { logger } from "@/app/utils/logger";
import { getMimeType } from "@/app/utils/api";
import { v4 } from "uuid";
import { api } from "@/app/utils/api";
import { Artifact } from "@/app/types/artifact";
import { ActionRunnerError } from "./message-parser";

export class ActionRunner {
  constructor(
    private terminalStore: TerminalStore,
    private filesStore: FilesStore,
    private chatStore: ChatStore,
    private webcontainer: WebContainer
  ) {}

  async run(action: Action) {
    logger.debug("running action", action);

    switch (action.command) {
      case "cd":
        return this.cd(action.arguments[0]);
      case "ls":
        return this.ls();
      case "pwd":
        return this.pwd();
      case "run":
        return this.runCommand(action.arguments);
      case "cat":
        return this.cat(action.arguments[0]);
      case "edit":
        return this.edit(action.arguments[0]);
      case "open":
        return this.open(action.arguments[0]);
      case "create":
        return this.create(action.arguments[0], action.arguments[1]);
      case "rm":
        return this.rm(action.arguments[0]);
      case "mv":
        return this.mv(action.arguments[0], action.arguments[1]);
      case "get":
        return this.get(action.arguments[0]);
      case "clone":
        return this.clone(action.arguments[0]);
      default:
        throw new ActionRunnerError(`unknown command: ${action.command}`);
    }
  }

  private async get(path: string): Promise<void> {
    const file = await this.webcontainer.fs.readFile(path);
    const mimeType = getMimeType(path);
    const id = v4();

    const artifact: Artifact = {
      id,
      name: path.split("/").pop() || "file",
      content: file,
      mimeType,
    };

    this.chatStore.addArtifact(artifact);

    const message: Message = {
      id: v4(),
      from: "system",
      content: `Downloaded file ${path}`,
      artifacts: [id],
    };

    this.chatStore.addMessage(message);
  }

  private async clone(url: string): Promise<void> {
    const message: Message = {
      id: v4(),
      from: "system",
      content: `Cloning ${url}...`,
    };

    this.chatStore.addMessage(message);

    try {
      await this.runCommand(["git", "clone", url, "."]);
      const successMessage: Message = {
        id: v4(),
        from: "system",
        content: `Successfully cloned ${url}`,
      };
      this.chatStore.addMessage(successMessage);
    } catch (e) {
      const failureMessage: Message = {
        id: v4(),
        from: "system",
        content: `Failed to clone ${url}`,
      };
      this.chatStore.addMessage(failureMessage);
    }
  }

  private async mv(from: string, to: string): Promise<void> {
    await this.webcontainer.fs.renameFile(from, to);
    this.filesStore.refresh();

    const message: Message = {
      id: v4(),
      from: "system",
      content: `Moved ${from} to ${to}`,
    };

    this.chatStore.addMessage(message);
  }

  private async rm(path: string): Promise<void> {
    await this.webcontainer.fs.rm(path);
    this.filesStore.refresh();

    const message: Message = {
      id: v4(),
      from: "system",
      content: `Removed ${path}`,
    };

    this.chatStore.addMessage(message);
  }

  private async create(path: string, content?: string): Promise<void> {
    const safeContent = content || "";
    await this.webcontainer.fs.writeFile(path, safeContent);
    this.filesStore.refresh();

    const message: Message = {
      id: v4(),
      from: "system",
      content: `Created ${path}`,
    };

    this.chatStore.addMessage(message);
  }

  private async open(path: string): Promise<void> {
    const content = await this.webcontainer.fs.readFile(path);
    const mimeType = getMimeType(path);
    const id = v4();

    const artifact: Artifact = {
      id,
      name: path.split("/").pop() || "file",
      content,
      mimeType,
    };

    this.chatStore.addArtifact(artifact);

    const message: Message = {
      id: v4(),
      from: "system",
      content: `Opened file ${path}`,
      artifacts: [id],
    };

    this.chatStore.addMessage(message);
  }

  private async edit(path: string): Promise<void> {
    const content = await this.webcontainer.fs.readFile(path);
    const mimeType = getMimeType(path);
    this.filesStore.openFile({
      path,
      content,
      mimeType,
    });
  }

  private async cat(path: string): Promise<void> {
    const content = await this.webcontainer.fs.readFile(path);
    const isText = !isBinary(null, content);

    const message: Message = {
      id: v4(),
      from: "system",
      content: isText ? stripIndent(content.toString()) : `Binary content of ${path}`,
    };
    this.chatStore.addMessage(message);

    if (!isText) {
      const mimeType = getMimeType(path);
      const id = v4();
      const artifact: Artifact = {
        id,
        name: path.split("/").pop() || "file",
        content,
        mimeType,
      };
      this.chatStore.addArtifact(artifact);
      message.artifacts = [id];
    }
  }

  private async runCommand(command: string[]): Promise<void> {
    const process = await this.webcontainer.spawn(command[0], command.slice(1));

    this.terminalStore.addProcess(process);

    const exitCode = await process.exit;

    if (exitCode !== 0) {
      const message: Message = {
        id: v4(),
        from: "system",
        content: `Command failed with exit code ${exitCode}`,
      };

      this.chatStore.addMessage(message);
    }
  }

  private async pwd(): Promise<void> {
    const pwd = await this.webcontainer.fs.readFile("/pwd");
    const message: Message = {
      id: v4(),
      from: "system",
      content: pwd.toString(),
    };
    this.chatStore.addMessage(message);
  }

  private async ls(): Promise<void> {
    const files = await this.webcontainer.fs.readdir(".");

    const message: Message = {
      id: v4(),
      from: "system",
      content: files.join("\n"),
    };
    this.chatStore.addMessage(message);
  }

  private async cd(path: string): Promise<void> {
    if (path.startsWith("/")) {
      await this.webcontainer.fs.writeFile("/pwd", path);
    } else {
      const current = (await this.webcontainer.fs.readFile("/pwd")).toString();
      const next = `${current}/${path}`.replace(/\/\//g, "/");
      await this.webcontainer.fs.writeFile("/pwd", next);
    }

    const pwd = await this.webcontainer.fs.readFile("/pwd");

    const message: Message = {
      id: v4(),
      from: "system",
      content: `Current directory: ${pwd.toString()}`,
    };
    this.chatStore.addMessage(message);
  }
}
