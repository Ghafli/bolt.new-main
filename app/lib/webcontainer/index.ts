import { WebContainer } from "@webcontainer/api";
import { writable, type Writable } from "svelte/store";
import { authenticateWebcontainer } from "./auth.client";
import { api } from "~/app/utils/api";
import { toast } from "../stores/toast";
import {
  DEFAULT_FILES,
  type FileSystemTree,
  type WorkerConfiguration,
} from "./types";

export const webcontainerInstance: Writable<WebContainer | null> =
  writable(null);

export const webcontainerStatus: Writable<
  "idle" | "loading" | "ready" | "error"
> = writable("idle");

let webcontainer: WebContainer;

export async function startWebcontainer({
  files = DEFAULT_FILES,
  workerConfig,
}: {
  files?: FileSystemTree;
  workerConfig?: WorkerConfiguration;
} = {}) {
  webcontainerStatus.set("loading");
  try {
    if (webcontainer) {
      await webcontainer.teardown();
    }
    webcontainer = await WebContainer.boot();
    webcontainerInstance.set(webcontainer);

    if (workerConfig?.bindings) {
      // inject the bindings into the worker
      const auth = await authenticateWebcontainer();
      if (auth) {
        await webcontainer.fs.writeFile(
          "/bindings.sh",
          `export BINDINGS='${JSON.stringify(workerConfig.bindings)}'
        export AUTH_TOKEN='${auth}'
        `
        );
        await webcontainer.exec({
          command: "bash",
          args: ["/bindings.sh"],
        });
      }
    }

    await webcontainer.mount(files);

    const installProcess = await webcontainer.exec({
      command: "pnpm",
      args: ["install"],
    });

    // this resolves when the install is done
    await installProcess.exit;

    webcontainerStatus.set("ready");
    return webcontainer;
  } catch (e) {
    webcontainerStatus.set("error");
    console.error("Failed to start webcontainer", e);
    toast.error("Failed to start webcontainer");
    throw e;
  }
}

export async function stopWebcontainer() {
  if (!webcontainer) {
    return;
  }
  webcontainerStatus.set("idle");
  await webcontainer.teardown();
  webcontainerInstance.set(null);
}

export async function updateWebcontainerFiles(files: FileSystemTree) {
  if (!webcontainer) {
    return;
  }
  await webcontainer.mount(files);
}
