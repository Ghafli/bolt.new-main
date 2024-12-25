import { ChatMessage } from "./terminal";
import { Artifact } from "./artifact";

export type Action =
  | {
      type: "write";
      text: string;
    }
  | {
      type: "clear";
    }
  | {
      type: "run";
      command: string;
    }
  | {
    type: "update_chat";
    messages: ChatMessage[]
  }
  | {
      type: "set_artifact";
      artifact: Artifact;
    }
    | {
      type: "close_artifact";
    }
    | {
      type: "reset";
    }
  | {
      type: "error";
      error: string;
    }
  | {
    type: 'open_file';
    path: string;
  }
  | {
    type: 'create_file';
    path: string;
    content: string;
  }
