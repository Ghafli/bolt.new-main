import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { isbot } from "isbot";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
    const bot = isbot(request.headers.get('user-agent') ?? '')
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);


    responseHeaders.set("Content-Type", "text/html");
  return new Response(
    `<!DOCTYPE html>
    <html lang="en" ${bot ? 'data-bot': ''}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
        ${bot ? `<meta name="robots" content="noindex, nofollow" />` : ''}
        ${remixContext.meta.join('\n')}
      ${remixContext.styles.join("\n")}
        <script>window.__remixContext=${JSON.stringify(remixContext)}</script>
    </head>
    <body>
      <div id="root">${markup}</div>
        ${remixContext.scripts.join("\n")}
    </body>
    </html>`,
    {
      headers: responseHeaders,
      status: responseStatusCode,
    }
  );
}
