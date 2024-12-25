import { parseCommands, ActionRunnerError } from "./message-parser";

describe("message parser", () => {
  describe("command parsing", () => {
    it("should parse simple command", () => {
      expect(parseCommands("ls")).toMatchSnapshot();
    });

    it("should parse simple command with args", () => {
      expect(parseCommands("npm install react")).toMatchSnapshot();
    });

    it("should parse commands with arguments", () => {
      expect(parseCommands("run npm install react")).toMatchSnapshot();
    });

    it("should parse commands with string argument", () => {
      expect(parseCommands("cd /some/path/here")).toMatchSnapshot();
    });

    it("should parse commands with no arguments", () => {
      expect(parseCommands("ls")).toMatchSnapshot();
    });


    it("should return null if no command", () => {
      expect(parseCommands("hello world")).toMatchSnapshot();
    });

    it("should parse multiple commands with arguments", () => {
      expect(parseCommands("run npm install react\nls\ncd /some/path/here")).toMatchSnapshot();
    });

    it("should parse multiple commands with no arguments", () => {
       expect(parseCommands("ls\npwd")).toMatchSnapshot();
    });

     it("should trim input", () => {
      expect(parseCommands("  ls  ")).toMatchSnapshot();
    });

  });


});
