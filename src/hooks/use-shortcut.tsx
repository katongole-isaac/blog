import { useEffect } from "react";

const useShortcut = (key: string, cb: () => void) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        cb();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, cb]);
};

export default useShortcut;
