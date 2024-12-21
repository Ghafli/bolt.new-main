// app/routes/api.chat.ts
import { Request } from "node-fetch";
import { handleApiError } from "@/app/utils/api";
import { Logger } from "@/app/utils/logger";
import { useChat } from "@/app/lib/stores/chat";
import { type Messages, streamText } from "@/app/lib/.server/llm/stream-text";
import { action } from "./chat"; // assumes that the old logic is in /app/routes/chat.ts


const rateLimit = new Map<string, number[]>();
const MAX_REQUESTS = 5;
const TIME_WINDOW = 60 * 1000; // 1 minute

const rateLimitMiddleware = (req: Request) => {
    const ip = req.headers.get("x-forwarded-for") || 'local';
    if(!ip){
        return;
    }
    const requests = rateLimit.get(ip) || [];

    const now = Date.now();
    const recentRequests = requests.filter(time => now - time < TIME_WINDOW);
    rateLimit.set(ip, recentRequests);

    if (recentRequests.length >= MAX_REQUESTS) {
        return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { 'Content-Type': 'application/json' } })
    }
    rateLimit.set(ip, [...recentRequests, now]);
};

// This is a modified version of the old code that makes it compatible with a streaming response
const actionRunner = async (message: string, onToken: (token: string | undefined) => void) => {
		const {messages} = await new Request("http://localhost", {method: "POST", body: JSON.stringify({messages: [{role: 'user', content: message}]})}).json<{ messages: Messages }>()
		const response = await action({context: {} as any, request: new Request("http://localhost", {method: "POST", body: JSON.stringify({messages: [{role: 'user', content: message}]})})});

	 const reader = response.body?.getReader();

		if(!reader){
			return;
		}
	 while(true){
		  const {done, value} = await reader.read();

		  if(done){
			  break;
		  }
		  onToken(new TextDecoder().decode(value));
	 }
	 onToken(undefined);
};
export const POST = async (req: Request) => {
    const rateLimitResponse = rateLimitMiddleware(req);
    if(rateLimitResponse){
       return rateLimitResponse;
    }

    try {
       const { message } = await req.json();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    await actionRunner(message, (token) => {
                        if (token !== undefined) {
                            controller.enqueue(new TextEncoder().encode(token));
                        }
                    });
                } catch (error) {
                    controller.error(error);
                }
                finally{
                    controller.close();
                }

            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain' },
         });
    }
    catch(e){
        return handleApiError(e, "Error processing chat message");
    }
};
