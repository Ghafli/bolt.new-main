import { classNames } from "./classNames";

describe("classNames", () => {
  it("should return an empty string when no arguments are passed", () => {
    expect(classNames()).toBe("");
  });

  it("should return a single class name when a single string is passed", () => {
    expect(classNames("foo")).toBe("foo");
  });

  it("should return multiple class names when multiple strings are passed", () => {
    expect(classNames("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("should return class names based on truthy values in an object", () => {
    expect(
      classNames({
        foo: true,
        bar: false,
        baz: true,
      })
    ).toBe("foo baz");
  });

  it("should handle a mix of strings and objects", () => {
    expect(
      classNames("foo", {
        bar: true,
        baz: false,
      }, "qux", {
        quux: true,
      })
    ).toBe("foo bar qux quux");
  });

    it("should ignore falsy values in an object", () => {
        expect(
            classNames({
                foo: true,
                bar: false,
                baz: undefined,
                qux: null,
                quux: 0,
                corge: "",
            })
        ).toBe("foo");
    });
});
