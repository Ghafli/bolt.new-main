import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Toast.module.scss';

type ToastType = 'success' | 'error' | 'info';
type ToastMessage = {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
};
type ToastContextProps = {
  show: (message: string, type?: ToastType, duration?: number) => void;
};
const ToastContext = createContext<ToastContextProps>({
  show: () => {},
});

type ToastProviderProps = {
  children: React.ReactNode;
};
export function ToastProvider({ children }: ToastProviderProps) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const show = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      const id = nextId.current++;
      setMessages((prev) => [...prev, { id, type, message, duration }]);
    },
    [],
  );

  const removeMessage = useCallback((id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  useEffect(() => {
    if (!messages.length) return;

    const currentMessage = messages[messages.length - 1];

    const timer = setTimeout(() => {
      removeMessage(currentMessage.id);
    }, currentMessage.duration);

    return () => clearTimeout(timer);
  }, [messages, removeMessage]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={styles.toastContainer}>
        <TransitionGroup component={null}>
          {messages.map((message) => (
            <CSSTransition
              key={message.id}
              timeout={200}
              classNames={{
                enter: styles.enter,
                enterActive: styles.enterActive,
                exit: styles.exit,
                exitActive: styles.exitActive,
              }}
            >
              <Toast message={message} onDismiss={() => removeMessage(message.id)} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  return useContext(ToastContext);
};

type ToastProps = {
  message: ToastMessage;
  onDismiss: () => void;
};

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ message, onDismiss }, ref) => {
    const getIcon = () => {
      if (message.type === 'success') {
        return (
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.225 5.999a1 1 0 0 0-1.256-.21l-7.15 5.694-3.597-3.221a1 1 0 1 0-1.35 1.498l4.386 3.93a1 1 0 0 0 1.26.062l7.917-6.321a1 1 0 0 0-.152-1.432Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"
              fill="currentColor"
            />
          </svg>
        );
      }
      if (message.type === 'error') {
        return (
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm-1-5h2v2h-2v-2Zm0-7h2v6h-2v-6Z"
              fill="currentColor"
            />
          </svg>
        );
      }
      return (
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm0-4c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm0-6c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2Z"
            fill="currentColor"
          />
        </svg>
      );
    };

    return (
      <div
        ref={ref}
        className={styles.toast}
        onClick={onDismiss}
        role="alert"
      >
        <div className={styles.icon}>{getIcon()}</div>
        {message.message}
      </div>
    );
  },
);
