import { WebContainer } from "@webcontainer/api";
import { Files } from "@/app/lib/stores/files";

interface File {
    name: string;
    type: "file" | "directory";
    children?: File[];
}


export const getFilesFromWebContainer = async (webContainer: WebContainer): Promise<Files> => {
    const files: Files = [];

    const traverseDir = async (dirPath: string, currentFiles: File[]): Promise<void> => {
        const entries = await webContainer.fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = `${dirPath}/${entry.name}`;
            if (entry.isDirectory()) {
                const newDir: File = {
                    name: entry.name,
                    type: "directory",
                    children: []
                };
               await traverseDir(entryPath, newDir.children!);
               currentFiles.push(newDir);
            } else {
                currentFiles.push({ name: entry.name, type: "file" });
            }
        }
    };

    await traverseDir("/", files);

    return files;
}
