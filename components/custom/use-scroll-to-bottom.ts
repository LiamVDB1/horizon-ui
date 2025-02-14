import { useEffect, useRef, RefObject } from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver((mutations) => {
        // Only scroll if we have actual childList changes (new messages)
        const hasNewMessages = mutations.some(
            mutation => mutation.type === 'childList' && mutation.addedNodes.length > 0
        );

        if (hasNewMessages) {
          end.scrollIntoView({ behavior: "instant", block: "end" });
        }
      });

      observer.observe(container, {
        childList: true,    // Keep this to watch for new messages
        subtree: false,     // Don't need to watch nested changes
        attributes: false,  // Don't watch attribute changes (tooltips)
        characterData: false // Don't need to watch text changes
      });

      return () => observer.disconnect();
    }

  }, []);

  return [containerRef, endRef];
}