import { useRef, useEffect } from 'react';
import { useChat } from '~/app/lib/stores/chat';

export function MessagesClient() {
  const ref = useRef<HTMLDivElement>(null);
  const { messages } = useChat();


  useEffect(() => {
    if(ref.current) {
        const el = ref.current;
        el.scrollTo({ top: el.scrollHeight });
    }

  }, [messages])


  return (
    <div ref={ref} className="flex-1 overflow-y-auto">

    </div>
  );
}
