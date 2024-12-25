import { useRef, useState } from 'react';
import { Artifact } from '~/app/components/chat/Artifact';
import { CodeBlock } from '~/app/components/chat/CodeBlock';
import { Markdown } from '~/app/components/chat/Markdown';
import { useMessageParser } from '~/app/lib/hooks/useMessageParser';
import { Message, MessageContent } from '~/app/types/chat';
import { classNames } from '~/app/utils/classNames';
import { useSnapScroll } from '~/app/lib/hooks/useSnapScroll';
import { LoadingDots } from '../ui/LoadingDots';
import { useTheme } from '~/app/lib/stores/theme';

type Props = {
  message: Message;
  isPending?: boolean;
  onContentChange?: (content: MessageContent) => void;
};

export function AssistantMessage({ message, isPending, onContentChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const { theme } = useTheme();
  useSnapScroll(ref);

  const { content, artifacts } = useMessageParser(message, onContentChange);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 p-4 text-gray-500 dark:text-gray-400">
        <LoadingDots />
      </div>
    );
  }


  return (
    <div
      ref={ref}
      className={classNames(
        'group relative flex w-full flex-col gap-2 p-4 text-gray-800 dark:text-gray-100',
        theme === 'dark' && 'bg-gray-800',
      )}
    >
      {content?.map((node, i) => {
        if (node.type === 'text') {
          return (
            <Markdown
              key={i}
              className="break-words"
              text={node.text}
            />
          );
        }

        if (node.type === 'code') {
          return <CodeBlock key={i} code={node.code} language={node.language} />;
        }
        return null;
      })}

      {artifacts?.length ? (
        <div
        className={classNames(
            "transition-[height] ease-in-out overflow-hidden",
            showArtifacts ? "max-h-[500px]" : "max-h-0"
        )}
        >
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {artifacts.map((artifact) => (
                  <Artifact key={artifact.id} artifact={artifact} />
                ))}
            </div>
        </div>

      ) : null}
      {artifacts?.length ? <div className='relative flex justify-center'>
            <button
              onClick={() => setShowArtifacts((prev) => !prev)}
              className={classNames('group absolute left-1/2 -bottom-2 translate-x-[-50%] transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200', showArtifacts && 'rotate-180')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="transition-transform group-hover:translate-y-1"
              >
                <path d="M11.998 17.782L3.78 9.565 5.193 8.15 11.998 14.957 18.806 8.15 20.22 9.565z"></path>
              </svg>
              
            </button>
          </div> : null}

    </div>
  );
}
