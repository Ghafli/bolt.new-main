// app/components/chat/Messages.client.tsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@/app/lib/stores/chat";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";
import { useSnapScroll } from "@/app/lib/hooks/useSnapScroll";
import styles from "./BaseChat.module.scss";

const Messages: React.FC = () => {
    const { messages, addMessage } = useChat();
    const { snap } = useSnapScroll();

    const chatBottomRef = useRef<HTMLDivElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const fetchStreamedResponse = async (message: string) => {
        setIsStreaming(true);
          let partialResponse = "";

        try {
             const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            if (!response.body) {
              throw new Error("No response body");
            }
            const reader = response.body.getReader();
                while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                    const chunk = new TextDecoder().decode(value);
                    partialResponse+=chunk;
                    addMessage({ type: "assistant", content: partialResponse });
              }

            }
         catch (error) {
            console.error("Error fetching stream response:", error);
         }
         finally {
             setIsStreaming(false);
         }
    };


    const handleSendMessage = async (message: string) => {
        if(!message || isStreaming) {
            return;
        }
        addMessage({ type: "user", content: message });
          fetchStreamedResponse(message);
    };
    useEffect(() => {
         snap('chat', { smooth: true, block: 'end' })
    },[messages, snap]);


    return (
        <div
            className={styles.chat}
            style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}
            id="chat"
        >
            {messages.map((message, index) => (
                message.type === "user" ? (
                    <UserMessage key={index} content={message.content} />
                ) : (
                    <AssistantMessage key={index} content={message.content} />
                )
            ))}
             <div ref={chatBottomRef}></div>
        </div>
    );
};

export default Messages;
