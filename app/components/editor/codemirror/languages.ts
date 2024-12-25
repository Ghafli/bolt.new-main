import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { LanguageSupport } from "@codemirror/language";
import { sql } from "@codemirror/lang-sql";
import { python } from "@codemirror/lang-python";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import { swift } from "@codemirror/lang-swift";
import { wasm } from "@codemirror/lang-wasm";
import { yaml } from "@codemirror/lang-yaml";
import { toml } from "@codemirror/lang-toml";
import { typescript } from "@codemirror/lang-typescript";
import { jsx } from "@codemirror/lang-jsx";
import { tsx } from "@codemirror/lang-tsx";

export const language = (mimeType: string): LanguageSupport | [] => {
  switch (mimeType) {
    case "application/json":
      return json();
    case "text/javascript":
    case "application/javascript":
      return javascript();
    case "text/html":
      return html();
    case "text/css":
      return css();
    case "text/markdown":
      return markdown();
    case "text/x-sql":
      return sql();
    case "text/x-python":
      return python();
    case "application/x-httpd-php":
      return php();
    case "text/x-rustsrc":
      return rust();
    case "text/x-c++src":
      return cpp();
    case "text/x-java":
      return java();
    case "text/x-go":
      return go();
    case "text/x-swift":
      return swift();
    case "application/wasm":
      return wasm();
    case "application/x-yaml":
      return yaml();
    case "application/toml":
      return toml();
    case "application/typescript":
      return typescript();
      case "text/jsx":
        return jsx();
      case "text/tsx":
        return tsx();
    default:
      return [];
  }
};
