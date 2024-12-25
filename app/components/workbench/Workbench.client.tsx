import { forwardRef, useState } from 'react';
import { useWebContainer } from '~/app/lib/webcontainer';
import styles from './Workbench.module.scss';
import { EditorPanel } from './EditorPanel';
import { FileTree } from './FileTree';
import { FileBreadcrumb } from './FileBreadcrumb';
import { Terminal } from './terminal/Terminal';
import { Preview } from './Preview';
import { GitCommands } from './GitCommands';
import { PortManager } from './PortManager';
import { useEditor } from '~/app/lib/stores/editor';
import { usePreviews } from '~/app/lib/stores/previews';
import { ResourceMonitor } from './ResourceMonitor';

type WorkbenchProps = {
  className?: string;
};

export const Workbench = forwardRef<HTMLDivElement, WorkbenchProps>(
  ({ className }, ref) => {
    const {
      isSupported,
      isLoading,
      error,
      start,
      stop,
      isWebContainerReady,
    } = useWebContainer();
    const { currentFile, openFile } = useEditor();
    const { currentPreview, openPreview } = usePreviews();
    const [fileTreeWidth, setFileTreeWidth] = useState(200);
    const [previewPanelWidth, setPreviewPanelWidth] = useState(300);

    const handleResize = (e: React.MouseEvent, setter: (value: number) => void) => {
      const startX = e.clientX;
      const startWidth = ref.current?.getBoundingClientRect().width ?? 0;

      const handleMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startX;
        if (ref.current) {
          const width = ref.current.getBoundingClientRect().width;
          const currentWidth =
            startWidth === 0 ? width : startWidth;
          setter(currentWidth + diff);
        }
      };

      const handleUp = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    };

    if (!isSupported) {
      return <div className={styles.error}>WebContainers are not supported in your browser</div>;
    }

    if (isLoading) {
      return <div className={styles.loading}>Loading WebContainer...</div>;
    }

    if (error) {
      return (
        <div className={styles.error}>
          WebContainer failed to start. {error?.message}
        </div>
      );
    }

    const handleSelectFile = async (path: string) => {
      openFile(path);
    };

    const handleSelectPreview = async (path: string) => {
      openPreview(path);
    };

    const segments = currentFile?.path?.split('/')?.filter(Boolean) ?? [];
    return (
      <div ref={ref} className={className ?? styles.workbench}>
        <div className={styles.topBar}>
          <div className={styles.left}>
            <GitCommands />
            <PortManager />
            <ResourceMonitor />
          </div>
          {isWebContainerReady && (
            <div className={styles.actions}>
              <button onClick={start} disabled={isWebContainerReady}>
                Start
              </button>
              <button onClick={stop} disabled={!isWebContainerReady}>
                Stop
              </button>
            </div>
          )}
        </div>
        <div className={styles.main}>
          <div
            className={styles.fileTree}
            style={{ '--file-tree-width': `${fileTreeWidth}px` }}
          >
            <FileTree onSelectFile={handleSelectFile} />
            <div
              className={styles.resizeHandle}
              onMouseDown={(e) => handleResize(e, setFileTreeWidth)}
            ></div>
          </div>
          <div className={styles.content}>
            <div className={styles.editor}>
              {currentFile && (
                <>
                  <FileBreadcrumb segments={segments} />
                  <EditorPanel id={currentFile.path} />
                </>
              )}
              <Terminal id="main" className={styles.terminal} />
            </div>
            <div
              className={styles.previewPanel}
              style={{ '--preview-panel-width': `${previewPanelWidth}px` }}
            >
              {currentPreview && (
                <Preview id={currentPreview.path} onClose={handleSelectPreview} />
              )}
              <div
                className={styles.resizeHandle}
                onMouseDown={(e) => handleResize(e, setPreviewPanelWidth)}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
