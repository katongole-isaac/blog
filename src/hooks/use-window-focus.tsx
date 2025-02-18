import { useCallback, useEffect } from "react";

const useWindowFocus = (callback: (visibility: DocumentVisibilityState) => void) => {
  
  const stableCallback = useCallback(callback, []);

  useEffect(() => {

    const handleVisibilityChange = () => {
      stableCallback(document.visibilityState);
    };

    const handleFocus = () => {
      stableCallback(document.visibilityState);
    };


    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stableCallback]);
};

export default useWindowFocus;
