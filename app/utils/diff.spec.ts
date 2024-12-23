// app/utils/diff.spec.ts
import { diff } from "./diff";

describe("diff", () => {
  it("should return an empty array if the two strings are equal", () => {
    const str1 = "Hello World";
    const str2 = "Hello World";
    expect(diff(str1, str2)).toEqual([]);
  });

  it("should return a list of diffs if the two strings are different", () => {
     const str1 = "Hello World";
    const str2 = "Hello Brave New World";
    const result = diff(str1, str2);
    expect(result).toEqual([
       { type: "equal", value: "Hello " },
      { type: "insert", value: "Brave New " },
      { type: "equal", value: "World" }
    ])
  });
  it("should return a list of diffs with a removal", () => {
     const str1 = "Hello Brave New World";
    const str2 = "Hello World";
    const result = diff(str1, str2);
      expect(result).toEqual([
          { type: "equal", value: "Hello " },
        { type: "remove", value: "Brave New " },
      { type: "equal", value: "World" }
    ])
  });

  it("should handle empty strings", () => {
    const str1 = "";
    const str2 = "Hello World";
    expect(diff(str1, str2)).toEqual([
        { type: "insert", value: "Hello World" }
    ]);

    const str3 = "Hello World";
    const str4 = "";
     expect(diff(str3, str4)).toEqual([
      { type: "remove", value: "Hello World" }
    ]);

    expect(diff("", "")).toEqual([])
  });
});
