import { FunctionComponent, useMemo } from "react";
import { useWorkbenchStore } from "~/app/lib/stores/workbench";
import { useChatStore } from "~/app/lib/stores/chat";
import { groupByDate } from "./date-binning";
import { HistoryItem } from "./HistoryItem";
import { useTheme } from "~/app/lib/stores/theme";
import { classNames } from "~/app/utils/classNames";

const Menu: FunctionComponent = () => {
  const { chats, activeChatId } = useChatStore();
  const { sideBarOpen } = useWorkbenchStore();
  const { theme } = useTheme();

  const groupedHistory = useMemo(() => {
    return groupByDate(
      Object.entries(chats).map(([id, { description, createdAt }]) => ({
        id,
        description,
        date: createdAt,
      })),
    );
  }, [chats]);

  return (
    <aside
      className={classNames(
        "group flex h-full flex-col border-r border-color-border bg-color-bg-1 p-2 transition-all",
        sideBarOpen ? "w-[200px]" : "w-0",
        theme === "dark" ? "dark" : "light",
      )}
    >
      <div className="mb-4 font-medium text-color-text-1">History</div>
      <div className="flex h-full flex-col gap-2 overflow-auto">
        {groupedHistory.map(({ date, items }) => (
          <div key={date} className="flex flex-col gap-1">
            <div
              className={classNames(
                "mb-1 text-color-text-4 text-xs",
                !sideBarOpen && "opacity-0",
                "transition-opacity duration-200",
              )}
            >
              {date}
            </div>
            {items.map(({ id, description, date }) => (
              <HistoryItem
                key={id}
                id={id}
                description={description}
                date={date}
                isActive={id === activeChatId}
              />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Menu;
