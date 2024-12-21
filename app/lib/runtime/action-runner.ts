// app/lib/runtime/action-runner.ts
import { messageParser } from "./message-parser";
import { Logger } from "@/app/utils/logger";
import { fetchWithRetries } from "@/app/lib/fetch";
import { stripIndent } from "@/app/utils/stripIndent";
import { Action } from "@/app/types/actions";
import { env } from "@/load-context";
import { ActionRunnerCallback } from "@/app/types/artifact";
import { ActionRunner as ActionRunnerType, ActionState } from "./action-runner";
import { WebContainer } from "@webcontainer/api";


const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
};

// Old action runner that interacts with webcontainer
export class ActionRunner implements ActionRunnerType {
	#webcontainer: Promise<WebContainer>;
	#currentExecutionPromise: Promise<void> = Promise.resolve();

	actions = null

	constructor(webcontainerPromise: Promise<WebContainer>) {
		this.#webcontainer = webcontainerPromise;
	}

	addAction = (data) => {

	};

	runAction = async (data) => {
		const { actionId } = data;
		return this.#executeAction(actionId)
	};


	async #executeAction(actionId: string) {

	}

	async #runShellAction(action: ActionState) {
        if (action.type !== 'shell') {
           return
        }

        const webcontainer = await this.#webcontainer;

        const process = await webcontainer.spawn('jsh', ['-c', action.content], {
            env: { npm_config_yes: true },
        });

        process.output.pipeTo(
            new WritableStream({
                write(data) {
					// here you can use the callback to stream to the client,
					// but we do not need it because the output
					// is streamed via the API call below
                    console.log(data);
                },
            }),
        );

        const exitCode = await process.exit;

        Logger.debug(`Process terminated with code ${exitCode}`);
	};

    async #runFileAction(action: ActionState) {

		if (action.type !== 'file') {
            return
        }

        const webcontainer = await this.#webcontainer;
         let folder = nodePath.dirname(action.filePath);

        // remove trailing slashes
        folder = folder.replace(/\/+$/g, '');

        if (folder !== '.') {
            try {
                await webcontainer.fs.mkdir(folder, { recursive: true });
                Logger.debug('Created folder', folder);
            } catch (error) {
                Logger.error('Failed to create folder\n\n', error);
            }
        }

        try {
            await webcontainer.fs.writeFile(action.filePath, action.content);
             Logger.debug(`File written ${action.filePath}`);
        } catch (error) {
           Logger.error('Failed to write file\n\n', error);
        }
	};
}

export const actionRunner = async (
    message: string,
    callback?: ActionRunnerCallback
) => {
    const actions = messageParser(message);
    if (!actions) {
        return null;
    }
    let response = "";
    for (const action of actions) {
        if (action.type === "chat") {
            response += await chatAction(action.prompt, callback);
        } else if (action.type === "shell") {
            response += await shellAction(action.command, callback);
        }
		else if (action.type === "file"){
			 const webContainerPromise = new ActionRunner(null as any)
			 const fileAction = await webContainerPromise.runAction(action)
			 if (callback) {
                callback(fileAction as any);
            }
		}
    }
    return response;
};

const chatAction = async (prompt: string, callback?: ActionRunnerCallback) => {
    try {
        const response = await fetchWithRetries("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: defaultHeaders,
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                stream: true,
            }),
        });

        if (!response.body) {
            throw new Error("No response body");
        }

        const reader = response.body.getReader();
        let partialResponse = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = new TextDecoder().decode(value);

            const lines = chunk.split("data: ");

            for (const line of lines) {
                if (line.startsWith("[DONE]")) {
                    break;
                }

                 if (line) {
                    try {
                       const json = JSON.parse(line);
                       const content = json.choices[0].delta?.content
                        if(content) {
                            partialResponse+=content;
                              if (callback) {
                                 callback(content);
                               }
                         }
                    } catch (e) {
                       Logger.error("Error parsing stream chunk", e)
                    }
                }

            }
        }
        return partialResponse;

    } catch (e) {
        Logger.error("Error during chat action", e);
        return "An error occurred while processing your request.";
    }
};

const shellAction = async (command: string, callback?: ActionRunnerCallback) => {
    try {
        const response = await fetchWithRetries("/api/shell", {
            method: "POST",
            headers: defaultHeaders,
            body: JSON.stringify({ command }),
        });
        if (!response.ok) {
            throw new Error("Shell action failed");
        }
        const { output } = await response.json();
        if (callback) {
           callback(output);
        }
        return output
    } catch (e) {
         Logger.error("Error during shell action", e);
        return "An error occurred while executing shell command.";
    }
};
