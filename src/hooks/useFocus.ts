import { useEffect, useRef } from "react";

const useFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return inputRef;
};

export default useFocus;
