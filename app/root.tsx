import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "@remix-run/react";
import { isMobile } from "./utils/mobile";
import { ThemeProvider } from "./components/ui/ThemeSwitch";
import { Toast } from "./components/ui/Toast";
import { Header } from "./components/header/Header";
import styles from "./styles/index.scss";
import { useShortcuts } from "./lib/hooks/useShortcuts";
import { useIsomorphicLayoutEffect } from "./utils/react";

export const links = () => {
    return [{rel: 'stylesheet', href: styles}]
}

export default function App() {
    const themeSettings = useLoaderData<typeof loader>();
    useShortcuts()
    useIsomorphicLayoutEffect(() => {
        if (isMobile()) {
          document.body.classList.add('is-mobile')
        }
    }, [])

  return (
      <ThemeProvider initialSettings={themeSettings}>
          <Meta />
          <Links />
        <Header/>
        <div className="page">
              <Outlet />
              <Toast />
        </div>
          <Scripts />
          <LiveReload />
      </ThemeProvider>
  );
}


export const loader = () => {
    return {
        theme: 'dark',
        terminalOpacity: 0.7
    }
}
