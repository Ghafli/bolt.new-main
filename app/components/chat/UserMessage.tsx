import { useRef } from 'react';
import { Markdown } from '~/app/components/chat/Markdown';
import { useMessageParser } from '~/app/lib/hooks/useMessageParser';
import { Message } from '~/app/types/chat';
import { useSnapScroll } from '~/app/lib/hooks/useSnapScroll';

type Props = {
  message: Message;
};

export function UserMessage({ message }: Props) {
    const ref = useRef<HTMLDivElement>(null)
  const { content } = useMessageParser(message);
    useSnapScroll(ref)

  return (
    <div ref={ref} className="flex w-full flex-col items-end gap-2 p-4">
      <div className="w-full max-w-[80%] rounded-md bg-gray-100 p-2 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
        {content?.map((node, i) => {
          if (node.type === 'text') {
            return <Markdown key={i} text={node.text} />;
          }

          return null;
        })}
      </div>
    </div>
  );
}
