import { FunctionComponent } from "react";
import { useChatStore } from "~/app/lib/stores/chat";
import { useWorkbenchStore } from "~/app/lib/stores/workbench";
import { classNames } from "~/app/utils/classNames";

export interface Props {
  id: string;
  description: string;
  date: string;
  isActive: boolean;
}

const HistoryItem: FunctionComponent<Props> = ({
  id,
  description,
  date,
  isActive,
}) => {
  const { openChat, setActiveChatId } = useChatStore();
  const { sideBarOpen } = useWorkbenchStore();

  const onClick = () => {
    setActiveChatId(id);
    openChat();
  };

  return (
    <button
      onClick={onClick}
      className={classNames(
        "group flex w-full cursor-pointer flex-col items-start gap-1 rounded-sm p-2 hover:bg-color-bg-3",
        isActive && "bg-color-bg-2",
        !sideBarOpen && "opacity-0",
        "transition-opacity duration-200",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={classNames(
            "font-medium text-color-text-1 group-hover:underline",
            isActive && "font-semibold",
          )}
        >
          {description}
        </div>
        <div
          className={classNames(
            "text-color-text-4 text-xs",
            isActive && "text-color-text-2",
          )}
        >
          {date}
        </div>
      </div>
    </button>
  );
};

export default HistoryItem;
