import { TerminalLine } from "../types/terminal";

export function parseTerminalOutput(output: string): TerminalLine[] {
  const lines = output.split("\n");
  return lines.map((line) => ({
    type: "stdout",
    content: line,
  }));
}
