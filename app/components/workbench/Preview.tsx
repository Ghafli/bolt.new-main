import { forwardRef, useEffect, useRef, useState } from 'react';
import styles from './Preview.module.scss';
import { usePreviews } from '~/app/lib/stores/previews';
import { classNames } from '~/app/utils/classNames';

type PreviewProps = {
  id: string;
  className?: string;
  onClose?: () => void;
};

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ id, className, onClose }, ref) => {
    const { previewUrl, closePreview } = usePreviews(id);
    const [isLoaded, setIsLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleClose = () => {
      closePreview();
      onClose?.();
    };

    useEffect(() => {
      setIsLoaded(false);
      if (iframeRef.current && previewUrl) {
        iframeRef.current.src = previewUrl;
      }
    }, [previewUrl]);

    const handleLoad = () => {
      setIsLoaded(true);
    };
    if (!previewUrl) {
      return null;
    }

    return (
      <div ref={ref} className={classNames(styles.preview, className)}>
        <div className={styles.header}>
          <div className={styles.title}>Preview</div>
          <button className={styles.closeButton} onClick={handleClose}>
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
          </button>
        </div>
        <div className={styles.content}>
          <iframe
            ref={iframeRef}
            title="Preview"
            onLoad={handleLoad}
            className={classNames(styles.iframe, { [styles.loaded]: isLoaded })}
          />
          {!isLoaded && <div className={styles.loading}>Loading...</div>}
        </div>
      </div>
    );
  },
);
