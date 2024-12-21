// app/lib/webcontainer/index.ts
import { WebContainer } from "@webcontainer/api";
import { terminal } from "@/app/lib/stores/terminal";
import { Files } from "@/app/lib/stores/files";
import { getFilesFromWebContainer } from "@/app/utils/shell";
let webcontainerInstance: WebContainer | null = null;
let sessionId: string | null = null;
const WEBCONTAINER_STORAGE_KEY = "webcontainer-data"
let forwardedPorts: number[] = [];

const getWebcontainerInstance = async () => {
    if (webcontainerInstance) {
        return webcontainerInstance;
    }

     try{
        const persistedSessionId = sessionStorage.getItem("sessionId");
       if(persistedSessionId){
            sessionId = persistedSessionId;
            webcontainerInstance = await WebContainer.resume(persistedSessionId);
        }else{
             const persistedData = localStorage.getItem(WEBCONTAINER_STORAGE_KEY);
            webcontainerInstance = await WebContainer.boot();

             if(persistedData){
                try{
                    const buffer = new Uint8Array(JSON.parse(persistedData).data)
                   await webcontainerInstance.fs.import(buffer);
                }
                 catch(e){
                    console.error("Error restoring from localStorage: ", e)
                }
             }

            sessionStorage.setItem("sessionId", webcontainerInstance.sessionId)
        }

        sessionId = webcontainerInstance.sessionId;

        return webcontainerInstance;
     } catch(e){
        console.error("Error getting WebContainer instance: ", e)
        return null;
     }

}
const saveState = async() => {
    const webContainer = await getWebcontainerInstance();
      if(!webContainer) {
            console.error("WebContainer not initialized");
            return;
        }
        try{
              const data = await webContainer.fs.export()
             const json = JSON.stringify({data: Array.from(data)});
                localStorage.setItem(WEBCONTAINER_STORAGE_KEY, json);
        }
        catch(e){
               console.error("Error saving to localStorage: ", e)
        }
}

export const useWebContainer = () => {
    const start = async () => {
       const webContainer = await getWebcontainerInstance();
        if(!webContainer){
            return;
        }

        const terminalProcess = await webContainer.spawn("jsh");
        terminal.setTerminalProcess(terminalProcess);
        const newFiles = await getFiles();
        if(newFiles){
          setFiles(newFiles);
        }
    }
  const beforeUnload = () => {
    saveState()
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', beforeUnload);
  }
    const writeFile = async (filePath: string, content: Uint8Array) => {
        const webContainer = await getWebcontainerInstance();
        if (!webContainer) {
            console.error("WebContainer not initialized");
            return;
        }

        try {
           await webContainer.fs.writeFile(filePath, content);
             await saveState();
        } catch (error) {
            console.error("Error writing file:", error);
        }
    };


    const getFiles = async () : Promise<Files|undefined> => {
        const webContainer = await getWebcontainerInstance();
        if(!webContainer) {
            console.error("WebContainer not initialized");
            return;
        }

        try{
            return await getFilesFromWebContainer(webContainer);
        }
        catch(error){
            console.error("Error getting files from WebContainer: ", error)
        }
    }
        const getResourceUsage = async () => {
            const webContainer = await getWebcontainerInstance();
           if(!webContainer){
                 console.error("WebContainer not initialized");
                return;
            }
             try {
                 const usage = await webContainer.getFsStats();
                return { cpu: usage.cpu, memory: usage.memory };
            } catch (error) {
                 console.error("Error getting resource usage:", error);
                return null;
            }
        };

    const exposePort = async (port: number) => {
        const webContainer = await getWebcontainerInstance();
        if(!webContainer) {
            console.error("WebContainer not initialized");
             return;
        }
         if (forwardedPorts.includes(port)) {
             return;
        }
        try{
            await webContainer.expose({ port: port });
           forwardedPorts.push(port);
       }catch(error){
            console.error("Error exposing port:", error);
        }
    }

     const getExposedPorts = () => {
        return forwardedPorts;
    }

    const {setFiles} = useFiles();
    return {
        start,
        writeFile,
        getFiles,
        sessionId,
        getResourceUsage,
        exposePort,
        getExposedPorts
    };
}
