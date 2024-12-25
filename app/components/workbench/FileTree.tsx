import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useFiles } from '~/app/lib/stores/files';
import styles from './FileTree.module.scss';
import { classNames } from '~/app/utils/classNames';

type FileTreeProps = {
  className?: string;
  onSelectFile?: (path: string) => void;
};

export const FileTree = forwardRef<HTMLDivElement, FileTreeProps>(
  ({ className, onSelectFile }, ref) => {
    const { files, loadFiles } = useFiles();
    const [expanded, setExpanded] = useState<string[]>([]);

    useEffect(() => {
      loadFiles();
    }, [loadFiles]);

    const toggleExpanded = useCallback(
      (path: string) => {
        setExpanded((prev) => {
          if (prev.includes(path)) {
            return prev.filter((p) => p !== path);
          }
          return [...prev, path];
        });
      },
      [setExpanded],
    );

    const handleClick = useCallback(
      (path: string) => {
        onSelectFile?.(path);
      },
      [onSelectFile],
    );

    const renderTree = useCallback(
      (tree: any, level: number = 0) => {
        return Object.entries(tree).map(([name, node]: [string, any]) => {
          const path = node.path;
          const isDir = typeof node === 'object' && node !== null;
          const isExpanded = expanded.includes(path);
          const hasChildren = isDir && Object.keys(node).length > 0;

          return (
            <div key={path} className={styles.node} style={{ '--level': level }}>
              <div className={styles.nodeContent}>
                {hasChildren && (
                  <button
                    onClick={() => toggleExpanded(path)}
                    className={classNames(styles.toggle, {
                      [styles.expanded]: isExpanded,
                    })}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 10.06L3.94 6L12.06 6L8 10.06Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                )}

                <button
                  className={classNames(styles.label, {
                    [styles.file]: !isDir,
                    [styles.folder]: isDir,
                  })}
                  onClick={() => handleClick(path)}
                >
                  {name}
                </button>
              </div>

              {isExpanded && isDir && (
                <div className={styles.children}>{renderTree(node, level + 1)}</div>
              )}
            </div>
          );
        });
      },
      [handleClick, toggleExpanded, expanded],
    );

    return (
      <div ref={ref} className={classNames(styles.fileTree, className)}>
        {files && renderTree(files)}
      </div>
    );
  },
);
