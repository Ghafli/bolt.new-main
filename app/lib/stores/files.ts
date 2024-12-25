import { atom } from "nanostores";
import { getPersistedItem, persistAtom } from "../persistence";
import { WebContainer } from "@webcontainer/api";
import { logger } from "@/app/utils/logger";

export type FilesState = {
    tree: string[]
}

const initial: FilesState = {
    tree: [],
}

export const $files = atom<FilesState>(getPersistedItem("files", initial));

export const refresh = async (webcontainer?: WebContainer) => {
    if (!webcontainer) return;

    try {
        const recurse = async (dir: string): Promise<string[]> => {
            const entries = await webcontainer.fs.readdir(dir);

            const files: string[] = [];
            for (const entry of entries) {
                const path = `${dir}/${entry}`.replace(/^\/\//, "/");
                const stat = await webcontainer.fs.stat(path)

                if (stat.isFile) {
                    files.push(path);
                } else if (stat.isDirectory) {
                  files.push(...await recurse(path))
                }

            }

            return files;
        };

        const files = await recurse(".");


        $files.set({
            tree: files,
        });
    } catch (e) {
      logger.error("error refreshing files", e)
    }
};

persistAtom($files, "files")
export type FilesStore = typeof $files;
