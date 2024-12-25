import { fetchRequestHandler } from "@remix-run/cloudflare";
import * as build from "../build/index.js";

export const onRequest: PagesFunction = async (context) => {
  return fetchRequestHandler({
    build,
    context: {
      ...context.env,
      cloudflare: context,
    } as any,
    request: context.request,
  });
};
