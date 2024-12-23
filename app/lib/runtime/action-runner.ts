--- a/app/lib/runtime/action-runner.ts
+++ b/app/lib/runtime/action-runner.ts
@@ -1,21 +1,11 @@
 import { messageParser } from "./message-parser";
 import { Logger } from "@/app/utils/logger";
 import { fetchWithRetries } from "@/app/lib/fetch";
-import { stripIndent } from "@/app/utils/stripIndent";
-import { Action } from "@/app/types/actions";
 import { env } from "@/load-context";
 import { ActionRunnerCallback } from "@/app/types/artifact";
-import { ActionRunner as ActionRunnerType, ActionState } from "./action-runner";
-import { WebContainer } from "@webcontainer/api";
-
-
 const defaultHeaders = {
     "Content-Type": "application/json",
     Authorization: `Bearer ${env.OPENAI_API_KEY}`,
-};
-
-// Old action runner that interacts with webcontainer
-export class ActionRunner implements ActionRunnerType {
-	#webcontainer: Promise<WebContainer>;
-	#currentExecutionPromise: Promise<void> = Promise.resolve();
-
-	actions = null
-
-	constructor(webcontainerPromise: Promise<WebContainer>) {
-		this.#webcontainer = webcontainerPromise;
-	}
-
-	addAction = (data) => {
-
-	};
-
-	runAction = async (data) => {
-		const { actionId } = data;
-		return this.#executeAction(actionId)
-	};
-
-
-	async #executeAction(actionId: string) {
-
-	}
-
-	async #runShellAction(action: ActionState) {
-        if (action.type !== 'shell') {
-           return
-        }
-
-        const webcontainer = await this.#webcontainer;
-
-        const process = await webcontainer.spawn('jsh', ['-c', action.content], {
-            env: { npm_config_yes: true },
-        });
-
-        process.output.pipeTo(
-            new WritableStream({
-                write(data) {
-					// here you can use the callback to stream to the client,
-					// but we do not need it because the output
-					// is streamed via the API call below
-                    console.log(data);
-                },
-            }),
-        );
-
-        const exitCode = await process.exit;
-
-        Logger.debug(`Process terminated with code ${exitCode}`);
-	};
-
-    async #runFileAction(action: ActionState) {
-
-		if (action.type !== 'file') {
-            return
-        }
-
-        const webcontainer = await this.#webcontainer;
-         let folder = nodePath.dirname(action.filePath);
-
-        // remove trailing slashes
-        folder = folder.replace(/\/+$/g, '');
-
-        if (folder !== '.') {
-            try {
-                await webcontainer.fs.mkdir(folder, { recursive: true });
-                Logger.debug('Created folder', folder);
-            } catch (error) {
-                Logger.error('Failed to create folder\n\n', error);
-            }
-        }
-
-        try {
-            await webcontainer.fs.writeFile(action.filePath, action.content);
-             Logger.debug(`File written ${action.filePath}`);
-        } catch (error) {
-           Logger.error('Failed to write file\n\n', error);
-        }
-	};
-}
+};
 
 export const actionRunner = async (
     message: string,
@@ -30,11 +20,6 @@
     for (const action of actions) {
         if (action.type === "chat") {
             response += await chatAction(action.prompt, callback);
-        } else if (action.type === "shell") {
-            response += await shellAction(action.command, callback);
-        }
-		else if (action.type === "file"){
-			 const webContainerPromise = new ActionRunner(null as any)
-			 const fileAction = await webContainerPromise.runAction(action)
-			 if (callback) {
-                callback(fileAction as any);
-            }
-		}
+        } else if (action.type === "shell") {
+            response += await shellAction(action.command, callback);
+        }
     }
     return response;
 };
