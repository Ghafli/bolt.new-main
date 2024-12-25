import { useMatches } from '@remix-run/react';
import { useChat } from '~/app/lib/stores/chat';
import { useEffect, useMemo } from 'react';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { BaseChat } from './BaseChat';
import { useAuth } from '~/app/lib/stores/auth';
import { ChatDescription } from '~/app/lib/persistence/ChatDescription.client';

export function ChatClient() {
  const matches = useMatches();
  const chatId = matches.at(-1)?.params?.id as string;
  const { messages, addMessage, pendingMessage } = useChat();
  const { user } = useAuth();


    const filteredMessages = useMemo(() => {
        return messages.filter((m) => m.chatId === chatId);
    }, [messages, chatId])
    
  const handleSendMessage = (message: string) => {
      if (!user?.id) {
          return;
      }
    addMessage({
      chatId,
      content: message,
      role: 'user',
    });
  };


    useEffect(() => {
        if (chatId) {
            window.document.title = `Chat ${chatId}`;
        }
    }, [chatId])
  return (
    <div className="flex h-full flex-col">
      <ChatDescription chatId={chatId} />
      <div className="flex-1 overflow-hidden">
        <BaseChat
          messages={filteredMessages}
          onSendMessage={handleSendMessage}
          inputPlaceholder="Ask me anything..."
          pendingMessage={pendingMessage?.chatId === chatId ? pendingMessage : undefined}
        >
          {filteredMessages.map((message, i) => {
            if (message.role === 'user') {
              return <UserMessage key={i} message={message} />;
            }
            return (
              <AssistantMessage
                key={i}
                message={message}
                  isPending={pendingMessage?.id === message.id && pendingMessage?.role === "assistant"}
              />
            );
          })}
            {pendingMessage?.chatId === chatId && pendingMessage?.role === 'assistant' && <AssistantMessage message={pendingMessage} isPending={true}/> }
        </BaseChat>
      </div>
    </div>
  );
}
