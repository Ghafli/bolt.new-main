import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Chat } from "~/app/components/chat/Chat.client";
import { PanelHeader } from "~/app/components/ui/PanelHeader";
import { Button } from "@kobalte/core";
import { useChatHistory } from "~/app/lib/persistence/useChatHistory";
import { useTheme } from "~/app/lib/stores/theme";

export async function loader() {
  return {};
}

export default function ChatRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { getChat, deleteChat } = useChatHistory();
  const [searchParams, setSearchParams] = useSearchParams();

  const chatId = params.id === "new" ? null : params.id;

  const initialChat = useMemo(() => {
    if (!chatId) return null;
    return getChat(chatId);
  }, [chatId, getChat]);

  const inputRef = useRef<HTMLInputElement>(null);

  // focus input on load and chat change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialChat]);

  useEffect(() => {
    const newChatId = searchParams.get("chatId");
    if (newChatId) {
      setSearchParams("");
      navigate(`/chat/${newChatId}`);
    }
  }, [navigate, searchParams, setSearchParams]);

  return (
    <div className={`panel ${theme}`}>
      <PanelHeader
        title={
          initialChat?.description || (
            <div className="flex items-center gap-2">
              <Form method="post">
                <input
                  ref={inputRef}
                  className="bg-transparent border-none text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                  name="message"
                  placeholder="New Chat"
                />
                <input type="hidden" name="chatId" value={chatId || ""} />
              </Form>
            </div>
          )
        }
      >
        {chatId ? (
          <Button
            onClick={() => {
              if (chatId) {
                deleteChat(chatId);
              }
              navigate("/");
            }}
          >
            Delete
          </Button>
        ) : (
          <></>
        )}
      </PanelHeader>
      <Chat chatId={chatId} initialMessages={initialChat?.messages || []} />
    </div>
  );
}
