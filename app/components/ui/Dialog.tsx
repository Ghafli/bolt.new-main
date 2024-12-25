import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useEscapeKey } from '~/app/lib/hooks';

type DialogContextProps = {
  open: (node: React.ReactNode) => void;
  close: () => void;
};

const DialogContext = createContext<DialogContextProps>({
  open: () => {},
  close: () => {},
});

type DialogProviderProps = {
  children: React.ReactNode;
};
export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setDialogContent(null);
  }, []);

  const open = useCallback((node: React.ReactNode) => {
    setDialogContent(node);
  }, []);

  useEscapeKey(close);

  useEffect(() => {
    if (dialogContent) {
      document.body.classList.add('dialog-open');
    } else {
      document.body.classList.remove('dialog-open');
    }

    return () => {
      document.body.classList.remove('dialog-open');
    };
  }, [dialogContent]);

  return (
    <DialogContext.Provider value={{ open, close }}>
      {children}
      {dialogContent &&
        createPortal(
          <div className="dialog-backdrop" ref={ref}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              {dialogContent}
            </div>
          </div>,
          document.body,
        )}
    </DialogContext.Provider>
  );
}

export const useDialog = () => {
  return useContext(DialogContext);
};

export type DialogProps = {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ children, className, onClose }, ref) => {
    const { close } = useDialog();

    const handleClose = useCallback(() => {
      close();
      onClose?.();
    }, [close, onClose]);

    return (
      <div className={className} ref={ref} role="dialog">
        {children}
        <button
          className="dialog-close-button"
          aria-label="Close dialog"
          onClick={handleClose}
        >
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
    );
  },
);
