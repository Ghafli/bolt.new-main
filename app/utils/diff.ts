type Diff =
  | { type: "equal"; value: string }
  | { type: "add"; value: string }
  | { type: "remove"; value: string };

export function diff(str1: string, str2: string): Diff[] {
  const result: Diff[] = [];
  let i = 0;
  let j = 0;

  while (i < str1.length || j < str2.length) {
    if (i < str1.length && j < str2.length && str1[i] === str2[j]) {
      let start = i;
      while (
        i < str1.length &&
        j < str2.length &&
        str1[i] === str2[j]
      ) {
        i++;
        j++;
      }
      result.push({ type: "equal", value: str1.substring(start, i) });
    } else {
      let start1 = i;
      while (i < str1.length && (j >= str2.length || str1[i] !== str2[j])) {
        i++;
      }
      if (start1 < i) {
        result.push({ type: "remove", value: str1.substring(start1, i) });
      }
      let start2 = j;
      while (j < str2.length && (i >= str1.length || str1[i] !== str2[j])) {
          j++
      }

        if (start2 < j) {
          result.push({ type: 'add', value: str2.substring(start2, j)});
        }
    }
  }

  return result;
}
