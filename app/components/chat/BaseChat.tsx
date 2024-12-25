import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from 'react';
import { SendButton } from '~/app/components/chat/SendButton.client';
import styles from './BaseChat.module.scss';
import { classNames } from '~/app/utils/classNames';

import { Message } from '~/app/types/chat';

type Props = {
  messages: Message[];
  onSendMessage: (message: string) => void;
  inputPlaceholder?: string;
  pendingMessage?: Message;
  children: React.ReactNode;
};

export function BaseChat({
  messages,
  onSendMessage,
  inputPlaceholder,
  pendingMessage,
  children,
}: Props) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if(messagesRef.current) {
      const el = messagesRef.current;
        if (isAtBottom) {
            el.scrollTo({ top: el.scrollHeight });
        }

      const handleScroll = () => {
        const isBottom = el.scrollHeight - el.scrollTop === el.clientHeight
        setIsAtBottom(isBottom);
      }
      el.addEventListener('scroll', handleScroll)

        return () => {
            el.removeEventListener('scroll', handleScroll)
        }

    }
  }, [messages, isAtBottom])


  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }
    onSendMessage(input);
    setInput('');
    if(inputRef.current) {
      inputRef.current.focus()
    }
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.baseChat}>
      <div ref={messagesRef} className={styles.messages}>
        {children}
      </div>
      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <textarea
            ref={inputRef}
            placeholder={inputPlaceholder}
          className={styles.input}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <SendButton type="submit" disabled={!input.trim()} />
      </form>
    </div>
  );
}
