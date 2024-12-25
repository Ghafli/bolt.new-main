export function parseCommand(command: string): { command: string, args: string[] } {
  const trimmedCommand = command.trim();
  const parts = trimmedCommand.split(/\s+/);
  const parsedCommand = parts[0];
  const args = parts.slice(1);

  return { command: parsedCommand, args };
}
