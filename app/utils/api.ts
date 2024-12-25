import { env } from "process";

export const api = {
  chat: async (messages: any) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(messages),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
        const err = await res.text()
      throw new Error(`Error fetching chat: ${res.status} ${err}`);
    }

    return res.json();
  },

  enhancePrompt: async (prompt: string) => {
    const res = await fetch("/api/enhancer", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });

      if (!res.ok) {
          const err = await res.text()
          throw new Error(`Error fetching enhancer: ${res.status} ${err}`);
      }
      return res.json();
  }
};
