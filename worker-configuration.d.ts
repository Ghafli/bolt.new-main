import type { RequestInit } from "node-fetch";
import type { IncomingHttpHeaders } from "http";

declare module "@remix-run/cloudflare" {
  /**
   * @internal
   */
  interface AppLoadContext {
    env: {
      [key: string]: string;
    };
    cloudflare: {
      waitUntil: (promise: Promise<any>) => void;
      request: {
        headers: IncomingHttpHeaders;
        method: string;
        cf: {
            colo: string;
            country: string;
        },
          url: string
      };
      fetch: (input: URL | string, init?: RequestInit) => Promise<Response>;
    };
  }
}
