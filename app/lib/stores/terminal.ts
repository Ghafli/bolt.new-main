import { atom } from "nanostores";
import { WebContainerProcess } from "@webcontainer/api";
import { getPersistedItem, persistAtom } from "../persistence";

export type TerminalState = {
  processes: WebContainerProcess[];
};

const initial: TerminalState = {
  processes: [],
};

export const $terminal = atom<TerminalState>(getPersistedItem("terminal", initial));

export const addProcess = (process: WebContainerProcess) => {
  $terminal.set({
    ...$terminal.get(),
    processes: [...$terminal.get().processes, process],
  });
};

export const removeProcess = (process: WebContainerProcess) => {
  $terminal.set({
    ...$terminal.get(),
    processes: $terminal.get().processes.filter((p) => p !== process),
  });
};

export const clearProcesses = () => {
    $terminal.set({
        processes: [],
    })
}

persistAtom($terminal, "terminal");
export type TerminalStore = typeof $terminal;
