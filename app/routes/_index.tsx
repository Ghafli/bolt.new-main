import { Button } from "@kobalte/core";
import { useLocation, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

import { Auth } from "~/app/components/auth/Auth";
import { Header } from "~/app/components/header/Header";
import { Settings } from "~/app/components/settings/settings";
import { Sidebar } from "~/app/components/sidebar/Menu.client";
import { Workbench } from "~/app/components/workbench/Workbench.client";
import { useTheme } from "~/app/lib/stores/theme";
import { useAuth } from "~/app/lib/stores/auth";
import { classNames } from "~/app/utils/classNames";

export default function Index() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <div className={classNames("app", theme)}>
      <Header />
      <Sidebar />
      <main className="main">
        {isAuthenticated ? (
          <>
            <Workbench />
            <Settings />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Auth />
            <Button
              onClick={() => {
                navigate("/chat/new");
              }}
            >
              or start a new chat
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
