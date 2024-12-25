import { Action } from "@/app/types/actions";
import { stripIndent } from "@/app/utils/stripIndent";

export class ActionRunnerError extends Error {}

export function parseCommands(input: string): Action[] | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const lines = trimmed.split("\n");

  const actions: Action[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    const parts = trimmedLine.split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    if (!command) {
      continue;
    }


    actions.push({
      command,
      arguments: args,
    });
  }

  return actions.length > 0 ? actions : null;
}

export function parseCodeBlock(input: string): string | null {
  const trimmed = stripIndent(input).trim();

  if (!trimmed) {
    return null;
  }

  const codeBlockRegex = /```.*\n([\s\S]*?)```/g;
  const match = codeBlockRegex.exec(trimmed);

    if (!match) {
      return null;
    }

  return match[1]
}
