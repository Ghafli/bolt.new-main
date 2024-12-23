--- a/app/components/chat/Messages.client.tsx
+++ b/app/components/chat/Messages.client.tsx
@@ -18,15 +18,15 @@
             }
             const reader = response.body.getReader();
                 while (true) {
-                const { done, value } = await reader.read();
-                if (done) {
-                    break;
-                }
+                    const { done, value } = await reader.read();
+                    if (done) {
+                        break;
+                    }
                     const chunk = new TextDecoder().decode(value);
                     partialResponse+=chunk;
                     addMessage({ type: "assistant", content: partialResponse });
-              }
-
+                }
+           
             }
          catch (error) {
             console.error("Error fetching stream response:", error);
