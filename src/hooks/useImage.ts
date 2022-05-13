import { useLayoutEffect, useRef, useState } from "react";

type Status = "loaded" | "loading" | "failed";
type CrossOrigin = "anonymous" | "use-credentials";
function useImage(
  url: string,
  crossOrigin?: CrossOrigin
): [undefined | HTMLImageElement, Status] {
  // lets use refs for image and status
  // so we can update them during render
  // to have instant update in status/image when new data comes in
  const statusRef = useRef<Status>("loading");
  const imageRef = useRef<HTMLImageElement>();

  // we are not going to use token
  // but we need to just to trigger state update
  const [_, setStateToken] = useState(0);

  // keep track of old props to trigger changes
  const oldUrl = useRef<string>();
  const oldCrossOrigin = useRef<string>();
  if (oldUrl.current !== url || oldCrossOrigin.current !== crossOrigin) {
    statusRef.current = "loading";
    imageRef.current = undefined;
    oldUrl.current = url;
    oldCrossOrigin.current = crossOrigin;
  }

  useLayoutEffect(() => {
    if (!url) return;
    const img = document.createElement("img");

    function onload() {
      statusRef.current = "loaded";
      imageRef.current = img;
      setStateToken(Math.random());
    }

    function onerror() {
      statusRef.current = "failed";
      imageRef.current = undefined;
      setStateToken(Math.random());
    }

    img.addEventListener("load", onload);
    img.addEventListener("error", onerror);

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    img.src = url;

    return () => {
      img.removeEventListener("load", onload);
      img.removeEventListener("error", onerror);
    };
  }, [url, crossOrigin]);

  // return array because it it better to use in case of several useImage hooks
  // const [background, backgroundStatus] = useImage(url1);
  // const [patter] = useImage(url2);
  return [imageRef.current, statusRef.current];
}

export default useImage;
