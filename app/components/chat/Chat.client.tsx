import React, { useEffect, useState } from "react";
import SendButton from "./SendButton.client";
import Messages from "./Messages.client";
import { useChat } from "@/app/lib/stores/chat";
import styles from "./BaseChat.module.scss";
import {  useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@/app/components/ui/IconButton";
import { useSnapScroll } from "@/app/lib/hooks/useSnapScroll";
import { useAuth } from "@/app/lib/stores/auth";
import { useLocation } from "react-router-dom";

const Chat: React.FC = () => {
    const { addMessage, messages, setMessages, started } = useChat();
    const [message, setMessage] = useState("");
      const { user } = useAuth();

      const navigate = useNavigate();
      const location = useLocation();

        const { id } = useParams<{id: string}>();
        const {snap} = useSnapScroll();
    const handleSendMessage = (newMessage: string) => {
         addMessage({ type: "user", content: newMessage });
         setMessage("");
    };
    const handleShareChat = async() => {
       if(!user){
           navigate('/auth');
           return;
       }
      const encodedMessages = encodeURIComponent(JSON.stringify(messages))
       navigate(`/chat/${encodedMessages}`);
    }
    React.useEffect(() => {
       if(id){

         try {
            const parsedMessages = JSON.parse(decodeURIComponent(id));
            setMessages(parsedMessages);
            snap('chat');
          }


           catch(e) {
            console.error("Error parsing chat", e)
          }
        }
    },[id, setMessages, snap])

      if(!started) {
          return (
              <div>
                   <h2>Welcome to Bolt!</h2>
                    <p>Sign in to start a chat.</p>
                </div>
         )
      }
    return (
        <div className={styles.baseChat}>
          <div className={styles.chatHeader}>
              <IconButton icon="back" onClick={() => navigate('/')}/>
              <IconButton icon="share" onClick={handleShareChat}/>
          </div>
          <Messages messages={messages} scrollId={'chat'} />
          <div className={styles.chatInput}>
              <input
              type="text"
              placeholder="Enter message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              />
              <SendButton onClick={() => handleSendMessage(message)} />
          </div>
        </div>
      );
};
export default Chat;
