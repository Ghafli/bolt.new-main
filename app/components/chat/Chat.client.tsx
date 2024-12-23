--- a/app/components/chat/Chat.client.tsx
+++ b/app/components/chat/Chat.client.tsx
@@ -1,15 +1,16 @@
-import React, { useState } from "react";
+import React, { useEffect, useState } from "react";
 import SendButton from "./SendButton.client";
 import Messages from "./Messages.client";
 import { useChat } from "@/app/lib/stores/chat";
 import styles from "./BaseChat.module.scss";
-import { useLocation, useNavigate, useParams } from "react-router-dom";
+import {  useNavigate, useParams } from "react-router-dom";
 import { IconButton } from "@/app/components/ui/IconButton";
 import { useSnapScroll } from "@/app/lib/hooks/useSnapScroll";
 import { useAuth } from "@/app/lib/stores/auth";
+import { useLocation } from "react-router-dom";
 
 const Chat: React.FC = () => {
-    const { addMessage, messages, setMessages } = useChat();
+    const { addMessage, messages, setMessages, started } = useChat();
     const [message, setMessage] = useState("");
       const { user } = useAuth();
 
@@ -20,7 +21,7 @@
         const {snap} = useSnapScroll();
     const handleSendMessage = (newMessage: string) => {
          addMessage({ type: "user", content: newMessage });
-        setMessage("");
+         setMessage("");
     };
     const handleShareChat = async() => {
        if(!user){
@@ -40,11 +41,14 @@
    }
    React.useEffect(() => {
       if(id){
+
          try {
             const parsedMessages = JSON.parse(decodeURIComponent(id));
             setMessages(parsedMessages);
             snap('chat');
           }
+
+
            catch(e) {
             console.error("Error parsing chat", e)
           }
@@ -52,13 +56,14 @@
        }
    },[id, setMessages, snap])
 
-    if(location.pathname === "/") {
+      if(!started) {
           return (
               <div>
                    <h2>Welcome to Bolt!</h2>
                     <p>Sign in to start a chat.</p>
                 </div>
          )
-    }
+      }
     return (
         <div className={styles.baseChat}>
           <div className={styles.chatHeader}>
