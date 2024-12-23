--- a/app/routes/chat.$id.tsx
+++ b/app/routes/chat.$id.tsx
@@ -1,7 +1,6 @@
-// app/routes/chat.$id.tsx
-import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
-import { default as IndexRoute } from './_index';
+import React from "react";
+import Chat from "@/app/components/chat/Chat.client";
 
-export async function loader(args: LoaderFunctionArgs) {
-  return json({ id: args.params.id });
-}
-
-export default IndexRoute;
+const ChatPage: React.FC = () => {
+  return <Chat />;
+};
+
+export default ChatPage;
