import { useCallback, useState } from "react";
import { useToast } from "../stores/toast";
import { useFetch } from "../fetch";

export const usePromptEnhancer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { fetch } = useFetch();

  const enhance = useCallback(
    async (prompt: string) => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/enhancer", {
          method: "POST",
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          const error = await response.text();
          addToast({
            message: `Failed to enhance prompt: ${error}`,
            type: "error",
          });
          return;
        }

        const { enhancedPrompt } = await response.json();

        return enhancedPrompt as string;
      } catch (error: any) {
        addToast({
          message: `Failed to enhance prompt: ${error.message}`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetch, addToast]
  );

  return { enhance, isLoading };
};
