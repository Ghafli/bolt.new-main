import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { generateRandomId } from "~/app/lib/crypto";
import { fetchApi } from "~/app/lib/fetch";
import { Message } from "~/app/types/terminal";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const chatId = formData.get("chatId") as string | null;

  if (!message) {
    return json({ error: "Message is required" }, { status: 400 });
  }

  let newChatId = chatId;
  if (!chatId) {
    newChatId = await generateRandomId();
  }

  const messageObject: Message = {
    id: await generateRandomId(),
    from: "user",
    text: message,
  };

  const apiResponse = await fetchApi("/api/chat", {
    method: "POST",
    body: {
      message: messageObject,
      chatId: newChatId,
    },
  });

  if (!apiResponse.ok) {
    console.error("API failed", await apiResponse.text());
    return json({ error: "API Error" }, { status: 500 });
  }

  const response = await apiResponse.json();
  return json(
    {
      ...response,
      newChatId,
    },
    { status: 200 }
  );
}
