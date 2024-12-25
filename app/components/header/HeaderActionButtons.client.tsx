import { FunctionComponent } from "react";
import { IconButton } from "~/app/components/ui/IconButton";
import { useWorkbenchStore } from "~/app/lib/stores/workbench";
import { useFileStore } from "~/app/lib/stores/files";
import { useChatStore } from "~/app/lib/stores/chat";
import { useTheme } from "~/app/lib/stores/theme";
import { classNames } from "~/app/utils/classNames";

const HeaderActionButtons: FunctionComponent = () => {
  const {
    openChat,
    isChatOpen,
    isGitActive,
    toggleGit,
    showPreview,
    setShowPreview,
  } = useWorkbenchStore();
  const { isDirty, saveFile } = useFileStore();
  const { activeChatId } = useChatStore();
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {isGitActive && (
        <IconButton
          aria-label="toggle git"
          icon="git"
          onClick={() => toggleGit()}
          active={isGitActive}
        />
      )}

      <IconButton
        aria-label="toggle preview"
        icon="preview"
        onClick={() => setShowPreview(!showPreview)}
        active={showPreview}
      />
      <IconButton
        aria-label="save"
        icon="save"
        disabled={!isDirty}
        onClick={saveFile}
      />
      <IconButton
        aria-label="chat"
        icon="chat"
        onClick={openChat}
        active={isChatOpen}
        badge={activeChatId ? undefined : "new"}
        className={classNames(
          activeChatId ? "" : "data-[badge]:bg-color-accent",
          theme === "dark" ? "dark" : "light",
        )}
      />
    </div>
  );
};

export default HeaderActionButtons;
