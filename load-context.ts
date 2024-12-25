import { type AppLoadContext } from "@remix-run/cloudflare";

export type LoadContext = AppLoadContext & {
  cloudflare: {
    env: {
      [key: string]: string
    };
    waitUntil(promise: Promise<any>): void;
  };
};

export const loadContext = (context: any): LoadContext => {
    return context
}
