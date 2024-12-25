import { type FC, useState } from "react";
import { IconButton } from "~/app/components/ui/IconButton";
import { useChatStore } from "../stores/chat";
import { useTranslation } from "react-i18next";

interface ChatDescriptionProps {
  id: string;
  description: string;
}

export const ChatDescription: FC<ChatDescriptionProps> = ({ id, description }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState(description);
  const { updateChatDescription } = useChatStore();
  const { t } = useTranslation();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateChatDescription(id, tempDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempDescription(description);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDescription(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <input
            className="rounded border border-gray-300 p-1 text-sm"
            value={tempDescription}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              } else if (e.key === "Escape") {
                handleCancel();
              }
            }}
            autoFocus
          />
          <IconButton
            icon="check"
            onClick={handleSave}
            aria-label={t("chat.edit.save")}
          />
          <IconButton
            icon="x"
            onClick={handleCancel}
            aria-label={t("chat.edit.cancel")}
          />
        </>
      ) : (
        <>
          <div className="line-clamp-1 text-sm text-gray-500">{description}</div>
          <IconButton
            icon="pencil"
            onClick={handleEdit}
            aria-label={t("chat.edit.edit")}
          />
        </>
      )}
    </div>
  );
};
