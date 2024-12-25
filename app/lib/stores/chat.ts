import { atom } from "nanostores";
import { Message } from "@/app/types/chat";
import { v4 } from "uuid";
import { getPersistedItem, persistAtom } from "../persistence";
import { Artifact } from "@/app/types/artifact";

export type ChatState = {
  messages: Message[];
  artifacts: { [id: string]: Artifact };
};

const initial: ChatState = {
  messages: [],
  artifacts: {},
};

export const $chat = atom<ChatState>(getPersistedItem("chat", initial));

export const addMessage = (message: Omit<Message, "id">) => {
  $chat.set({
    ...$chat.get(),
    messages: [...$chat.get().messages, { ...message, id: v4() }],
  });
};

export const addArtifact = (artifact: Artifact) => {
    $chat.set({
        ...$chat.get(),
        artifacts: {
            ...$chat.get().artifacts,
            [artifact.id]: artifact,
        }
    })
}

export const clearChat = () => {
    $chat.set(initial);
}

export const setMessages = (messages: Message[]) => {
  $chat.set({
      ...$chat.get(),
      messages,
  })
}

export const removeArtifact = (id: string) => {
  const { [id]: _, ...rest } = $chat.get().artifacts;

  $chat.set({
    ...$chat.get(),
    artifacts: rest
  })
}



export const addMessages = (messages: Message[]) => {
  $chat.set({
    ...$chat.get(),
    messages: [...$chat.get().messages, ...messages],
  });
};



persistAtom($chat, "chat");
export type ChatStore = typeof $chat;
