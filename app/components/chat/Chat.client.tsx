import { useRef, useState, useEffect } from 'react';
import { useRouteLoaderData } from '@remix-run/react';

import { useChatStore } from '~/app/lib/stores/chat';
import { useThemeStore } from '~/app/lib/stores/theme';
import { useSnapScroll } from '~/app/lib/hooks/useSnapScroll';
import { useShortcuts } from '~/app/lib/hooks/useShortcuts';
import { useMessageParser } from '~/app/lib/hooks/useMessageParser';
import { ChatType } from '~/app/types/chat';
import { BaseChat } from './BaseChat';
import { usePanelResizer } from '~/app/lib/hooks/usePanelResizer';
import { useMediaQuery } from '~/app/lib/hooks/useMediaQuery';
import { debounce } from '~/app/utils/debounce';
import { useWorkbenchStore } from '~/app/lib/stores/workbench';
import { useFileStore } from '~/app/lib/stores/files';

export default function ChatClient() {
  const { id: chatId } = useRouteLoaderData('routes/chat.$id') as { id: string };
  const chat = useChatStore((state) => state.chats[chatId]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isChatVisible = useWorkbenchStore((state) => state.isChatVisible);
  const files = useFileStore((state) => state.files);
  const panelRef = useRef<HTMLDivElement>(null);

  const [panelWidth, setPanelWidth] = useState(
    () => (isMobile ? undefined : 400)
  );

  usePanelResizer({
    panelRef,
    onResize: debounce(setPanelWidth, 100),
    initialSize: isMobile ? undefined : 400,
    side: 'right',
    minSize: 300,
    enabled: !isMobile,
  });

  const { snapToBottom } = useSnapScroll({
    scrollContainer: messagesContainerRef,
  });

  useShortcuts(
    {
      'mod+enter': () => {
        if (isMobile || isChatVisible) {
          document
            ?.querySelector<HTMLButtonElement>('[data-send-button]')
            ?.click();
        }
      },
    },
    [isMobile, isChatVisible]
  );

  const { parse } = useMessageParser();

  useEffect(() => {
    snapToBottom();
  }, [chat?.messages, snapToBottom]);

  useEffect(() => {
    // TODO: should not have to do this, refactor chat store.
    // This ensures that code blocks are highlighted correctly
    // after a theme change
    parse(chat?.messages || []);
  }, [theme, chat?.messages, parse]);

  if (!chat) {
    return <div className="flex-1 p-4 text-center">Loading...</div>;
  }

  return (
    <div
      ref={panelRef}
      style={{ width: panelWidth }}
      className="flex-1 border-l border-border-primary dark:border-border-secondary"
    >
      <BaseChat
        chat={chat as ChatType}
        messagesContainerRef={messagesContainerRef}
        snapToBottom={snapToBottom}
        files={files}
      />
    </div>
  );
}