import { type Artifact } from "~/app/types/artifact";
import { classNames } from "~/app/utils/classNames";
import { Icon } from "../ui/IconButton";
import styles from "./BaseChat.module.scss";
import { useChatStore } from "~/app/lib/stores/chat";
import { useWorkbenchStore } from "~/app/lib/stores/workbench";
import { useThemeStore } from "~/app/lib/stores/theme";

type Props = {
  artifact: Artifact;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
};

export function Artifact({ artifact, isExpanded, onToggle }: Props) {
  const { selectFile } = useWorkbenchStore();
  const { theme } = useThemeStore();
  const { setArtifactPreview } = useChatStore();
  return (
    <div
      className={classNames(styles.artifact, {
        [styles.expanded]: isExpanded,
        [styles.light]: theme === "light",
      })}
    >
      <div className={styles.artifact_header}>
        <div className={styles.artifact_icon}>
          <Icon name="file-code" size="sm" />
        </div>
        <div className={styles.artifact_details}>
          <span className={styles.artifact_filename}>{artifact.filename}</span>
          <span className={styles.artifact_size}>
            {artifact.size.toLocaleString()} bytes
          </span>
        </div>
        {onToggle && (
          <button
            className={classNames(styles.artifact_toggle)}
            onClick={() => onToggle(!isExpanded)}
          >
            <Icon name={isExpanded ? "chevron-down" : "chevron-right"} />
          </button>
        )}
      </div>
      {isExpanded && (
        <div className={styles.artifact_content}>
          {artifact.type === "file" ? (
            <button
              className={styles.artifact_preview}
              onClick={() => {
                selectFile(artifact.path);
              }}
            >
              Open
            </button>
          ) : (
            <button
              className={styles.artifact_preview}
              onClick={() => {
                setArtifactPreview(artifact.content);
              }}
            >
              Preview
            </button>
          )}
        </div>
      )}
    </div>
  );
}
