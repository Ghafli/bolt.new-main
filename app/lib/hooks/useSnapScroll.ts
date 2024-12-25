import { useCallback, useEffect, useRef } from "react";

export const useSnapScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const snapToBottom = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      // scroll snap-y isn't perfect, so we need to manually snap to the bottom when scrolling down
      const isAtBottom =
        scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >=
        scrollContainerRef.current.scrollHeight - 200;


        if (isAtBottom) {
           snapToBottom();
        }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [snapToBottom]);

  return { scrollContainerRef, snapToBottom };
};
