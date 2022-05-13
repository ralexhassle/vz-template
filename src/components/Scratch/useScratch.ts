import { RefObject, useEffect, useRef } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtomValue } from "jotai";

import {
  startScratchingAtom,
  scratchingAtom,
  stopScratchingAtom,
  hasFinishedAtom,
} from "./atoms";

type Event = MouseEvent | TouchEvent;

interface Props {
  cover: HTMLImageElement;
  width: number;
  height: number;
}
function useScratch({
  cover,
  width,
  height,
}: Props): [RefObject<HTMLCanvasElement>, boolean] {
  const ref = useRef<HTMLCanvasElement>(null);

  const hasFinished = useAtomValue(hasFinishedAtom);
  const startScratching = useUpdateAtom(startScratchingAtom);
  const scratching = useUpdateAtom(scratchingAtom);
  const stopScratching = useUpdateAtom(stopScratchingAtom);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    const listener = (event: Event) => startScratching({ canvas, event });

    canvas.addEventListener("mousedown", listener);
    canvas.addEventListener("touchstart", listener, {
      passive: true,
    });

    return () => {
      canvas.removeEventListener("mousedown", listener);
      canvas.removeEventListener("touchstart", listener);
    };
  }, [startScratching]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    const listener = (event: Event) => scratching({ canvas, event });

    canvas.addEventListener("mousemove", listener);
    canvas.addEventListener("touchmove", listener, {
      passive: true,
    });

    return () => {
      canvas.removeEventListener("mousemove", listener);
      canvas.removeEventListener("touchmove", listener);
    };
  }, [scratching]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    canvas.addEventListener("mouseup", stopScratching);
    canvas.addEventListener("touchend", stopScratching, {
      passive: true,
    });

    return () => {
      canvas.removeEventListener("mouseup", stopScratching);
      canvas.removeEventListener("touchend", stopScratching);
    };
  }, [stopScratching]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    if (!cover) return;

    context.drawImage(cover, 0, 0, width, height);
  }, [width, height, cover]);

  return [ref, hasFinished];
}

export default useScratch;
