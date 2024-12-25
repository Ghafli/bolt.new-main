import { FunctionComponent } from "react";
import { IconButton } from "~/app/components/ui/IconButton";
import { useWorkbenchStore } from "~/app/lib/stores/workbench";
import { Settings } from "../settings/settings";
import { HeaderActionButtons } from "./HeaderActionButtons.client";
import Logo from "~/icons/logo.svg";
import LogoText from "~/icons/logo-text.svg";
import { useTheme } from "~/app/lib/stores/theme";
import { ThemeSwitch } from "../ui/ThemeSwitch";
import { classNames } from "~/app/utils/classNames";

const Header: FunctionComponent = () => {
  const { setSideBarOpen, sideBarOpen } = useWorkbenchStore();
  const { theme } = useTheme();

  return (
    <header
      className={classNames(
        "z-20 flex h-14 items-center gap-2 border-b border-b-color-border bg-color-bg-1 px-2 text-color-text-1",
        theme === "dark" ? "dark" : "light",
      )}
    >
      <IconButton
        aria-label="toggle sidebar"
        onClick={() => setSideBarOpen(!sideBarOpen)}
        icon="menu"
      />
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8" />
        <LogoText className="h-4" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <HeaderActionButtons />
        <ThemeSwitch />
        <Settings />
      </div>
    </header>
  );
};

export default Header;
