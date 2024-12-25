type ClassNameValue = string | undefined | null | boolean | number;
type ClassNameObject = Record<string, ClassNameValue>;
type ClassNameArg = ClassNameValue | ClassNameObject;

export function classNames(...args: ClassNameArg[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (typeof arg === 'string' && arg) {
      classes.push(arg);
    } else if (typeof arg === 'object' && arg !== null) {
      for (const key in arg) {
        if (Object.hasOwn(arg, key) && arg[key]) {
            classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
