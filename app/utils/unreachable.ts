export function unreachable(value: never): never {
  throw new Error(`Unreachable code reached with value ${String(value)}`);
}
