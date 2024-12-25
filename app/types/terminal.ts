export type TerminalLine = {
    type: 'stdout' | 'stderr';
    content: string;
}

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
    artifacts?: string[]
}

export type TerminalState = {
  lines: TerminalLine[];
  isExecuting: boolean;
  pendingCommand: string;
  commandHistory: string[];
  commandHistoryIndex: number;
};
