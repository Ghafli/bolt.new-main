--- a/app/components/chat/Messages.client.tsx
+++ b/app/components/chat/Messages.client.tsx
@@ -1,12 +1,14 @@
 import React, { useEffect, useRef, useState } from "react";
 import { useChat } from "@/app/lib/stores/chat";
 import { AssistantMessage } from "./AssistantMessage";
-import { UserMessage } from "./UserMessage";
+import { UserMessage } from "@/app/components/chat/UserMessage";
 import { useSnapScroll } from "@/app/lib/hooks/useSnapScroll";
 import styles from "./BaseChat.module.scss";
+import { useToast } from "@/app/lib/stores/toast";
 
 const Messages: React.FC = () => {
     const { messages, addMessage } = useChat();
+    const {showToast} = useToast();
     const { snap } = useSnapScroll();
 
     const chatBottomRef = useRef<HTMLDivElement>(null);
@@ -27,8 +29,9 @@
                     addMessage({ type: "assistant", content: partialResponse });
               }
 
-            }
+           }
          catch (error) {
+             showToast({message: "Error fetching stream response", type: "error"});
             console.error("Error fetching stream response:", error);
          }
          finally {
