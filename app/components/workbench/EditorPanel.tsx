import { forwardRef, useState } from 'react';
import styles from './EditorPanel.module.scss';
import { useEditor } from '~/app/lib/stores/editor';
import { CodeMirrorEditor } from '../editor/codemirror/CodeMirrorEditor';
import { BinaryContent } from '../editor/codemirror/BinaryContent';
import { PanelHeader } from '../ui/PanelHeader';
import { PanelHeaderButton } from '../ui/PanelHeaderButton';

type EditorPanelProps = {
  id: string;
  className?: string;
  onClose?: () => void;
};

export const EditorPanel = forwardRef<HTMLDivElement, EditorPanelProps>(
  ({ id, className, onClose }, ref) => {
    const { file, closeFile, saveFile } = useEditor(id);

    const handleClose = () => {
      closeFile();
      onClose?.();
    };

    const handleSave = async () => {
      await saveFile();
    };

    if (!file) {
      return null;
    }
    return (
      <div className={className} ref={ref}>
        <PanelHeader className={styles.header}>
          <span className={styles.title}>{file.name}</span>
          <div className={styles.actions}>
            <PanelHeaderButton onClick={handleSave}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1.33334C4.459 1.33334 1.333 4.45934 1.333 8.00001C1.333 11.5407 4.459 14.6667 8 14.6667C11.541 14.6667 14.667 11.5407 14.667 8.00001C14.667 4.45934 11.541 1.33334 8 1.33334ZM8 13.3334C5.202 13.3334 2.667 10.7987 2.667 8.00001C2.667 5.20134 5.202 2.66668 8 2.66668C10.798 2.66668 13.333 5.20134 13.333 8.00001C13.333 10.7987 10.798 13.3334 8 13.3334ZM8 4.66668V7.33334H5.33333V8.66668H8V11.3334L10.667 8.00001L8 4.66668Z"
                  fill="currentColor"
                />
              </svg>
            </PanelHeaderButton>
            <PanelHeaderButton onClick={handleClose}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4 0.6L6 6L0.6 0.6L0 0L6 6L12 0L11.4 0.6ZM0 11.4L6 6L11.4 11.4L12 12L6 6L0 12L0 11.4Z"
                  fill="currentColor"
                />
              </svg>
            </PanelHeaderButton>
          </div>
        </PanelHeader>
        <div className={styles.content}>
          {file.isBinary ? (
            <BinaryContent id={id} />
          ) : (
            <CodeMirrorEditor id={id} />
          )}
        </div>
      </div>
    );
  },
);
