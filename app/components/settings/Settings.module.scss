// app/lib/webcontainer/index.ts
import { WebContainer } from "@webcontainer/api";
import { terminal } from "@/app/lib/stores/terminal";
import { Files } from "@/app/lib/stores/files"; // Import type if necessary
import { getFilesFromWebContainer } from "@/app/utils/shell";
import { useFiles } from "@/app/lib/stores/files"; // import useFiles

let webcontainerInstance: WebContainer | null = null;
let sessionId: string | null = null;

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
            webcontainerInstance = await WebContainer.boot();
            sessionStorage.setItem("sessionId", webcontainerInstance.sessionId)
        }

        sessionId = webcontainerInstance.sessionId;

        return webcontainerInstance;
     } catch(e){
        console.error("Error getting WebContainer instance: ", e)
        return null;
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
          setFiles(newFiles); // Update the file store after the terminal is running
        }
    }

    const writeFile = async (filePath: string, content: Uint8Array) => {
        const webContainer = await getWebcontainerInstance();
        if (!webContainer) {
            console.error("WebContainer not initialized");
            return;
        }

        try {
           await webContainer.fs.writeFile(filePath, content);
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
    const {setFiles} = useFiles(); // get setFiles function from useFiles()
    return {
        start,
        writeFile,
        getFiles,
        sessionId
    };
}
