import { useCallback, useEffect } from "react";

const useKeyPress = (key: string, callback: () => void) => {
  const onPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        callback();
      }
    },
    [key, callback]
  );

  useEffect(() => {
    document.addEventListener("keydown", onPress);
    return () => {
      document.removeEventListener("keydown", onPress);
    };
  }, [onPress]);
};

export default useKeyPress;
