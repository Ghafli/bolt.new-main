--- a/app/lib/runtime/message-parser.spec.ts
+++ b/app/lib/runtime/message-parser.spec.ts
@@ -1,115 +1,75 @@
-import { describe, expect, it, vi } from 'vitest';
-import { StreamingMessageParser, type ActionCallback, type ArtifactCallback } from './message-parser';
-
-interface ExpectedResult {
-  output: string;
-  callbacks?: {
-    onArtifactOpen?: number;
-    onArtifactClose?: number;
-    onActionOpen?: number;
-    onActionClose?: number;
-  };
-}
-
-describe('StreamingMessageParser', () => {
-  it('should pass through normal text', () => {
-    const parser = new StreamingMessageParser();
-    expect(parser.parse('test_id', 'Hello, world!')).toBe('Hello, world!');
-  });
-
-  it('should allow normal HTML tags', () => {
-    const parser = new StreamingMessageParser();
-    expect(parser.parse('test_id', 'Hello <strong>world</strong>!')).toBe('Hello <strong>world</strong>!');
-  });
-
-  describe('no artifacts', () => {
-    it.each<[string | string[], ExpectedResult | string]>([
-      ['Foo bar', 'Foo bar'],
-      ['Foo bar <', 'Foo bar '],
-      ['Foo bar <p', 'Foo bar <p'],
-      [['Foo bar <', 's', 'p', 'an>some text</span>'], 'Foo bar <span>some text</span>'],
-    ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
-      runTest(input, expected);
+import { messageParser } from "./message-parser";
+
+describe("messageParser", () => {
+    it("should return null for an empty message", () => {
+        expect(messageParser("")).toBeNull();
     });
-  });
-
-  describe('invalid or incomplete artifacts', () => {
-    it.each<[string | string[], ExpectedResult | string]>([
-      ['Foo bar <b', 'Foo bar '],
-      ['Foo bar <ba', 'Foo bar <ba'],
-      ['Foo bar <bol', 'Foo bar '],
-      ['Foo bar <bolt', 'Foo bar '],
-      ['Foo bar <bolta', 'Foo bar <bolta'],
-      ['Foo bar <boltA', 'Foo bar '],
-      ['Foo bar <boltArtifacs></boltArtifact>', 'Foo bar <boltArtifacs></boltArtifact>'],
-      ['Before <oltArtfiact>foo</boltArtifact> After', 'Before <oltArtfiact>foo</boltArtifact> After'],
-      ['Before <boltArtifactt>foo</boltArtifact> After', 'Before <boltArtifactt>foo</boltArtifact> After'],
-    ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
-      runTest(input, expected);
+
+    it("should parse a simple chat message", () => {
+        const message = "Hello, how are you?";
+        const result = messageParser(message);
+        expect(result).toEqual([{ type: "chat", prompt: message }]);
     });
-  });
-
-  describe('valid artifacts without actions', () => {
-    it.each<[string | string[], ExpectedResult | string]>([
-      [
-        'Some text before <boltArtifact title="Some title" id="artifact_1">foo bar</boltArtifact> Some more text',
-        {
-          output: 'Some text before  Some more text',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
-        },
-      ],
-      [
-        ['Some text before <boltArti', 'fact', ' title="Some title" id="artifact_1">foo</boltArtifact> Some more text'],
-        {
-          output: 'Some text before  Some more text',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
-        },
-      ],
-      [
-        [
-          'Some text before <boltArti',
-          'fac',
-          't title="Some title" id="artifact_1"',
-          ' ',
-          '>',
-          'foo</boltArtifact> Some more text',
-        ],
-        {
-          output: 'Some text before  Some more text',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
-        },
-      ],
-      [
-        [
-          'Some text before <boltArti',
-          'fact',
-          ' title="Some title" id="artifact_1"',
-          ' >fo',
-          'o</boltArtifact> Some more text',
-        ],
-        {
-          output: 'Some text before  Some more text',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
-        },
-      ],
-      [
-        [
-          'Some text before <boltArti',
-          'fact tit',
-          'le="Some ',
-          'title" id="artifact_1">fo',
-          'o',
-          '<',
-          '/boltArtifact> Some more text',
-        ],
-        {
-          output: 'Some text before  Some more text',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
-        },
-      ],
-      [
-        [
-          'Some text before <boltArti',
-          'fact title="Some title" id="artif',
-          'act_1">fo',
-          'o<',
-          '/boltArtifact> Some more text',
-        ],
-        {
-          output: 'Some text before  Some more text',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
-        },
-      ],
-      [
-        'Before <boltArtifact title="Some title" id="artifact_1">foo</boltArtifact> After',
-        {
-          output: 'Before  After',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 0, onActionClose: 0 },
-        },
-      ],
-    ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
-      runTest(input, expected);
+
+    it("should parse a message with a single shell command", () => {
+        const message = "run `ls -l`";
+        const result = messageParser(message);
+        expect(result).toEqual([{ type: "shell", command: "ls -l" }]);
     });
-  });
-
-  describe('valid artifacts with actions', () => {
-    it.each<[string | string[], ExpectedResult | string]>([
-      [
-        'Before <boltArtifact title="Some title" id="artifact_1"><boltAction type="shell">npm install</boltAction></boltArtifact> After',
-        {
-          output: 'Before  After',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 1, onActionClose: 1 },
-        },
-      ],
-      [
-        'Before <boltArtifact title="Some title" id="artifact_1"><boltAction type="shell">npm install</boltAction><boltAction type="file" filePath="index.js">some content</boltAction></boltArtifact> After',
-        {
-          output: 'Before  After',
-          callbacks: { onArtifactOpen: 1, onArtifactClose: 1, onActionOpen: 2, onActionClose: 2 },
-        },
-      ],
-    ])('should correctly parse chunks and strip out bolt artifacts (%#)', (input, expected) => {
-      runTest(input, expected);
+
+    it("should parse a message with multiple shell commands", () => {
+        const message = "run `ls -l` and then `pwd`";
+        const result = messageParser(message);
+         expect(result).toEqual([
+            { type: "shell", command: "ls -l" },
+             { type: "shell", command: "pwd" }
+         ]);
     });
-  });
+
+    it("should parse a message with chat and shell commands", () => {
+        const message = "Hello, how are you? run `ls -l`";
+        const result = messageParser(message);
+        expect(result).toEqual([
+            { type: "chat", prompt: "Hello, how are you?" },
+            { type: "shell", command: "ls -l" },
+        ]);
+    });
+
+    it("should handle multiple chat segments with shell command segments", () => {
+        const message = "Hello, how are you? run `ls -l` then tell me `pwd`. I'm good!";
+          const result = messageParser(message);
+        expect(result).toEqual([
+            { type: "chat", prompt: "Hello, how are you?" },
+             { type: "shell", command: "ls -l" },
+            { type: "chat", prompt: "then tell me `pwd`" },
+            { type: "chat", prompt: "I'm good!" },
+        ]);
+    });
+    it("should not include the special characters", () => {
+          const message = "Hello, how are you? run `ls -l` then tell me `pwd`";
+          const result = messageParser(message);
+        expect(result).toEqual([
+            { type: "chat", prompt: "Hello, how are you?" },
+             { type: "shell", command: "ls -l" },
+            { type: "chat", prompt: "then tell me `pwd`" }
+        ]);
+    });
+
+      it("should handle the case of commands with double quotes", () => {
+        const message = 'run `echo "Hello, World"`';
+        const result = messageParser(message);
+        expect(result).toEqual([ { type: 'shell', command: 'echo "Hello, World"' } ]);
+    });
+
+    it("should handle the case of multiple shell commands with double quotes", () => {
+        const message = 'run `echo "Hello, World"` and then `echo "Goodbye"`';
+           const result = messageParser(message);
+       expect(result).toEqual([
+            { type: 'shell', command: 'echo "Hello, World"' },
+             { type: 'shell', command: 'echo "Goodbye"' }
+           ]);
+     });
+     it("should handle nested backticks", () => {
+      const message = "tell me `hello` run ``ls``";
+         const result = messageParser(message)
+            expect(result).toEqual([
+                   { type: 'chat', prompt: "tell me `hello`" },
+                   { type: 'shell', command: 'ls' }
+               ])
+    })
+      it("should handle a chat message that starts with run", () => {
+           const message = "run tell me `ls`";
+            const result = messageParser(message)
+        expect(result).toEqual([
+          { type: 'chat', prompt: 'run tell me `ls`' },
+      ]);
+    })
 });
-
-function runTest(input: string | string[], outputOrExpectedResult: string | ExpectedResult) {
-  let expected: ExpectedResult;
-
-  if (typeof outputOrExpectedResult === 'string') {
-    expected = { output: outputOrExpectedResult };
-  } else {
-    expected = outputOrExpectedResult;
-  }
-
-  const callbacks = {
-    onArtifactOpen: vi.fn<ArtifactCallback>((data) => {
-      expect(data).toMatchSnapshot('onArtifactOpen');
-    }),
-    onArtifactClose: vi.fn<ArtifactCallback>((data) => {
-      expect(data).toMatchSnapshot('onArtifactClose');
-    }),
-    onActionOpen: vi.fn<ActionCallback>((data) => {
-      expect(data).toMatchSnapshot('onActionOpen');
-    }),
-    onActionClose: vi.fn<ActionCallback>((data) => {
-      expect(data).toMatchSnapshot('onActionClose');
-    }),
-  };
-
-  const parser = new StreamingMessageParser({
-    artifactElement: () => '',
-    callbacks,
-  });
-
-  let message = '';
-
-  let result = '';
-
-  const chunks = Array.isArray(input) ? input : input.split('');
-
-  for (const chunk of chunks) {
-    message += chunk;
-
-    result += parser.parse('message_1', message);
-  }
-
-  for (const name in expected.callbacks) {
-    const callbackName = name;
-
-    expect(callbacks[callbackName as keyof typeof callbacks]).toHaveBeenCalledTimes(
-      expected.callbacks[callbackName as keyof typeof expected.callbacks] ?? 0,
-    );
-  }
-
-  expect(result).toEqual(expected.output);
-}
