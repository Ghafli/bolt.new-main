// app/routes/api.enhancer.ts
import { Request } from "node-fetch";
import { handleApiError } from "@/app/utils/api";
import { Logger } from "@/app/utils/logger";
import { type Messages, streamText,  } from "@/app/lib/.server/llm/stream-text";
import { parseStreamPart } from "ai";
import { stripIndents } from "@/app/utils/stripIndent";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

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

// This is a recreation of what the previous logic was doing but now in the form of a hook
const usePromptEnhancer = async (message: string) => {
      const result = await streamText(
      [
        {
          role: 'user',
          content: stripIndents`
          I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

          IMPORTANT: Only respond with the improved prompt and nothing else!

          <original_prompt>
            ${message}
          </original_prompt>
        `,
        },
      ],
     {} as any,
    );

   let enhancedPrompt = '';
     const transformStream = new TransformStream({
      transform(chunk, controller) {
        const processedChunk = decoder
          .decode(chunk)
          .split('\n')
          .filter((line) => line !== '')
          .map(parseStreamPart)
          .map((part) => part.value)
          .join('');
		    enhancedPrompt += processedChunk;

        controller.enqueue(encoder.encode(processedChunk));
      },
    });

	  await result.toAIStream().pipeThrough(transformStream).pipeTo(new WritableStream())


    return enhancedPrompt;

}

export const POST = async (req: Request) => {
    const rateLimitResponse = rateLimitMiddleware(req);
    if(rateLimitResponse){
       return rateLimitResponse;
    }

     try{
        const { message } = await req.json();
         const enhancedPrompt = await usePromptEnhancer(message);
         return new Response(JSON.stringify({enhancedPrompt}), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
        });
      }
      catch(e){
          return handleApiError(e, "Error processing prompt enhancement");
      }
};
