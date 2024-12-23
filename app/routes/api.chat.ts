--- a/app/routes/api.chat.ts
+++ b/app/routes/api.chat.ts
@@ -1,11 +1,8 @@
 import { Request } from "node-fetch";
 import { handleApiError } from "@/app/utils/api";
-import { Logger } from "@/app/utils/logger";
-import { useChat } from "@/app/lib/stores/chat";
-import { type Messages, streamText } from "@/app/lib/.server/llm/stream-text";
-import { action } from "./chat"; // assumes that the old logic is in /app/routes/chat.ts
+import { actionRunner } from "@/app/lib/runtime/action-runner";
 
-
+// Rate Limiting
 const rateLimit = new Map<string, number[]>();
 const MAX_REQUESTS = 5;
 const TIME_WINDOW = 60 * 1000; // 1 minute
@@ -24,36 +21,7 @@
     }
     rateLimit.set(ip, [...recentRequests, now]);
 };
-
-// This is a modified version of the old code that makes it compatible with a streaming response
-const actionRunner = async (message: string, onToken: (token: string | undefined) => void) => {
-		const {messages} = await new Request("http://localhost", {method: "POST", body: JSON.stringify({messages: [{role: 'user', content: message}]})}).json<{ messages: Messages }>()
-		const response = await action({context: {} as any, request: new Request("http://localhost", {method: "POST", body: JSON.stringify({messages: [{role: 'user', content: message}]})})});
-
-	 const reader = response.body?.getReader();
-
-		if(!reader){
-			return;
-		}
-	 while(true){
-		  const {done, value} = await reader.read();
-
-		  if(done){
-			  break;
-		  }
-		  onToken(new TextDecoder().decode(value));
-	 }
-	 onToken(undefined);
-};
 export const POST = async (req: Request) => {
     const rateLimitResponse = rateLimitMiddleware(req);
     if(rateLimitResponse){
@@ -72,13 +40,11 @@
                 }
                 catch (error) {
                     controller.error(error);
-                }
-                finally{
+                } finally {
                     controller.close();
                 }
-
             },
         });
-
         return new Response(stream, {
             headers: { 'Content-Type': 'text/plain' },
          });
