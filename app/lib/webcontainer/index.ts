--- a/app/lib/webcontainer/index.ts
+++ b/app/lib/webcontainer/index.ts
@@ -2,6 +2,7 @@
 import { terminal } from "@/app/lib/stores/terminal";
 import { Files } from "@/app/lib/stores/files";
 import { getFilesFromWebContainer } from "@/app/utils/shell";
+import { useToast } from "../stores/toast";
 let webcontainerInstance: WebContainer | null = null;
 let sessionId: string | null = null;
 const WEBCONTAINER_STORAGE_KEY = "webcontainer-data"
@@ -17,8 +18,9 @@
        if(persistedSessionId){
             sessionId = persistedSessionId;
             webcontainerInstance = await WebContainer.resume(persistedSessionId);
+            console.log("WebContainer resumed from session:", persistedSessionId)
         }else{
-             const persistedData = localStorage.getItem(WEBCONTAINER_STORAGE_KEY);
+            const persistedData = localStorage.getItem(WEBCONTAINER_STORAGE_KEY);
             webcontainerInstance = await WebContainer.boot();
 
              if(persistedData){
@@ -28,12 +30,13 @@
                 }
                  catch(e){
                     console.error("Error restoring from localStorage: ", e)
+                     localStorage.removeItem(WEBCONTAINER_STORAGE_KEY)
                 }
              }
 
             sessionStorage.setItem("sessionId", webcontainerInstance.sessionId)
         }
-
+         console.log("WebContainer session id:", webcontainerInstance.sessionId)
         sessionId = webcontainerInstance.sessionId;
 
         return webcontainerInstance;
@@ -43,6 +46,7 @@
      }
 
 }
+
 const saveState = async() => {
     const webContainer = await getWebcontainerInstance();
       if(!webContainer) {
@@ -60,7 +64,6 @@
                console.error("Error saving to localStorage: ", e)
         }
 }
-
 export const useWebContainer = () => {
     const start = async () => {
        const webContainer = await getWebcontainerInstance();
@@ -151,6 +154,7 @@
     }
 
     const {setFiles} = useFiles();
+    const { setToast } = useToast();
     return {
         start,
         writeFile,
@@ -159,7 +163,8 @@
         sessionId,
         getResourceUsage,
         exposePort,
-        getExposedPorts
+        getExposedPorts,
+        setToast
     };
 }
