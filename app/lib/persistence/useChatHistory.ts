import { useCallback, useEffect, useState } from "react";
import { Chat } from "~/app/types/chat";
import { getDB } from "./db";

export const useChatHistory = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const db = await getDB();
      const allChats = await db.getAll("chats");
      setChats(allChats);
    } catch (e) {
      console.error("Failed to load chats", e);
      // TODO: add toast
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createChat = useCallback(async (chat: Omit<Chat, "id">) => {
    const id = crypto.randomUUID();
    const newChat = { ...chat, id };
    const db = await getDB();
    await db.put("chats", newChat);
    setChats((prev) => [...prev, newChat]);
    return id;
  }, []);

  const updateChat = useCallback(async (chat: Chat) => {
    const db = await getDB();
    await db.put("chats", chat);
    setChats((prev) => prev.map((c) => (c.id === chat.id ? chat : c)));
  }, []);

  const deleteChat = useCallback(async (id: string) => {
    const db = await getDB();
    await db.delete("chats", id);
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    chats,
    isLoading,
    createChat,
    updateChat,
    deleteChat,
  };
};
