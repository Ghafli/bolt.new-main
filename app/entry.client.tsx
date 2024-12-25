import { RemixBrowser } from "@remix-run/react";
import { startTransition } from "react";
import { init } from "./lib/webcontainer";

init().then(() => {
    startTransition(() => {
        const root = document.getElementById("root")
        if(root) {
           const ssrCache = window.__remixContext
           if(ssrCache) {
             delete window.__remixContext
           }
            // @ts-expect-error
           RemixBrowser.hydrateRoot(root, ssrCache)
        }
    })

})
