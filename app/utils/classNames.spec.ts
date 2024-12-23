// app/utils/classNames.spec.ts
import { classNames } from "./classNames";

describe("classNames", () => {
  it("should return an empty string if no arguments are provided", () => {
    expect(classNames()).toBe("");
  });
  it("should return a string with the classes", () => {
       expect(classNames("class1", "class2")).toBe("class1 class2");
  });
   it("should ignore falsey values", () => {
       expect(classNames("class1", false, undefined, "class2")).toBe("class1 class2");
   })
   it("should handle arrays", () => {
    expect(classNames("class1", ["class2", "class3"])).toBe("class1 class2 class3");
   })
    it("should handle multiple arrays", () => {
         expect(classNames(["class1", "class2"], ["class3", "class4"])).toBe("class1 class2 class3 class4");
    })
     it("should handle mixed arguments", () => {
          expect(classNames("class1", ["class2", "class3"], "class4", false)).toBe("class1 class2 class3 class4");
     })
});
