// app/lib/shell.ts
import type { WebContainer } from '@webcontainer/api';
import type { ITerminal } from '~/types/terminal';
import { withResolvers } from './promises';
import { Files } from '@/app/lib/stores/files';

interface File {
    name: string;
    type: "file" | "directory";
    children?: File[];
}


export async function newShellProcess(webcontainer: WebContainer, terminal: ITerminal) {
    const args: string[] = [];

    // we spawn a JSH process with a fallback cols and rows in case the process is not attached yet to a visible terminal
    const process = await webcontainer.spawn('/bin/jsh', ['--osc', ...args], {
        terminal: {
            cols: terminal.cols ?? 80,
            rows: terminal.rows ?? 15,
        },
    });

    const input = process.input.getWriter();
    const output = process.output;

    const jshReady = withResolvers<void>();

    let isInteractive = false;

    output.pipeTo(
        new WritableStream({
            write(data) {
                if (!isInteractive) {
                    const [, osc] = data.match(/\x1b\]654;([^\x07]+)\x07/) || [];

                    if (osc === 'interactive') {
                        // wait until we see the interactive OSC
                        isInteractive = true;

                        jshReady.resolve();
                    }
                }

                terminal.write(data);
            },
        }),
    );

    terminal.onData((data) => {
        if (isInteractive) {
            input.write(data);
        }
    });

    await jshReady.promise;

    return process;
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
