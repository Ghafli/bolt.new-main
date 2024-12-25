import { useCallback, useState } from "react";

import { parseMessage } from "~/app/lib/runtime/message-parser";
import { Action } from "~/app/types/actions";
import { useActionRunner } from "./useActionRunner";

export const useMessageParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { runAction } = useActionRunner();

  const onMessage = useCallback(
    async (message: string, onAction?: (action: Action) => void) => {
      setIsLoading(true);
      try {
        const actions = await parseMessage(message);

        if (!actions.length) return;

        for (const action of actions) {
          if (onAction) {
            onAction(action);
          }

          await runAction(action);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [runAction]
  );

  return { onMessage, isLoading };
};
