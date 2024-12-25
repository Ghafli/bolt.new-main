export type Artifact =
    | {
          type: "file";
          path: string;
          content: string;
      }
    | {
          type: "image";
          path: string;
          dataUrl: string;
      }
    | {
          type: "url";
          url: string;
      }
