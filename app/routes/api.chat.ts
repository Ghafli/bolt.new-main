// app/routes/api.chat.ts
import { Request } from "node-fetch";
import { handleApiError } from "@/app/utils/api";
import { Logger } from "@/app/utils/logger";
import { useChat } from "@/app/lib/stores/chat";
import { type Messages } from "@/app/lib/.server/llm/stream-text";
import { action } from "./chat"; // assumes that the old logic is in /app/routes/chat.ts

// ActionRunner needs to be updated to work with the new approach

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


// This is a modified version of the old code
// This is just a placeholder and needs to be adapted to your specific `actionRunner` needs
const actionRunner = async (message: string) => {
	    // Use the previous chat action to process the message.
		// It will send back a response to the client.
		const {messages} = await new Request("http://localhost", {method: "POST", body: JSON.stringify({messages: [{role: 'user', content: message}]})}).json<{ messages: Messages }>()

		const response = await action({context: {} as any, request: new Request("http://localhost", {method: "POST", body: JSON.stringify({messages: [{role: 'user', content: message}]})})});
    	const text = await response.text()
        return {response: text};
};

export const POST = async (req: Request) => {
    const rateLimitResponse = rateLimitMiddleware(req);
    if(rateLimitResponse){
       return rateLimitResponse;
    }

    try{
        const { message } = await req.json();
         const response = await actionRunner(message);
        return new Response(JSON.stringify({ response }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
     }
     catch(e){
        return handleApiError(e, "Error processing chat message");
     }
};
