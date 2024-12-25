import { diff } from "./diff";

describe("diff", () => {
  it("should return an empty array when the inputs are identical", () => {
    const str = "hello world";
    expect(diff(str, str)).toEqual([]);
  });

  it("should return an array of differences when the inputs are different", () => {
    const str1 = "hello world";
    const str2 = "hello there";
    expect(diff(str1, str2)).toEqual([
      { type: "equal", value: "hello " },
      { type: "remove", value: "world" },
      { type: "add", value: "there" },
    ]);
  });

  it("should handle added text at the beginning", () => {
    const str1 = "world";
    const str2 = "hello world";
    expect(diff(str1, str2)).toEqual([
      { type: "add", value: "hello " },
      { type: "equal", value: "world" },
    ]);
  });

  it("should handle removed text at the beginning", () => {
    const str1 = "hello world";
    const str2 = "world";
    expect(diff(str1, str2)).toEqual([
      { type: "remove", value: "hello " },
      { type: "equal", value: "world" },
    ]);
  });

  it("should handle single character differences", () => {
    const str1 = "cat";
    const str2 = "bat";
      expect(diff(str1, str2)).toEqual([
          { type: "remove", value: "c" },
          { type: "add", value: "b" },
          { type: "equal", value: "at" },
      ]);
  });

  it("should handle empty strings", () => {
    expect(diff("", "hello")).toEqual([{ type: "add", value: "hello" }]);
    expect(diff("hello", "")).toEqual([{ type: "remove", value: "hello" }]);
  });


    it('should handle multiple added and removed sections', () => {
      const str1 = 'this is the original text';
      const str2 = 'this was the modified text now';

      expect(diff(str1, str2)).toEqual([
        { type: 'equal', value: 'this ' },
        { type: 'remove', value: 'is' },
        { type: 'add', value: 'was' },
          {type: "equal", value: " the "},
          {type: "remove", value: "original"},
          {type: "add", value: "modified"},
        { type: 'equal', value: ' text' },
          { type: 'add', value: " now" },
      ]);
    });


});
