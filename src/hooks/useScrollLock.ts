import { useEffect } from "react";

// prevent body from scrolling when modal is open
function useScrollLock() {
  useEffect(() => {
    const y = document.documentElement.style.getPropertyValue("--scroll-y");
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}`;

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);
}

export function useScrollPosition() {
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.setProperty("--scroll-y", `${y}px`);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

export default useScrollLock;
