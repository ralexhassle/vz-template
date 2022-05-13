import { atom } from "jotai";
import { getMouse, computeDistance, computeAngle, getPixel } from "./helpers";
import BRUSH from "./brush";

const THRESHOLD = 70;
const NORMALIZE = 25;
const STRIDE = 25;
const BLENDING_MODE = "destination-out";

export const isDrawingAtom = atom(false);
export const hasFinishedAtom = atom(false);
export const pointAtom = atom({ x: 0, y: 0 });

export const stopScratchingAtom = atom(null, (_, set) => {
  set(isDrawingAtom, false);
  set(pointAtom, { x: 0, y: 0 });
});

interface StartScratchingUpdate {
  event: MouseEvent | TouchEvent;
  canvas: HTMLCanvasElement;
}
export const startScratchingAtom = atom(
  null,
  (_, set, update: StartScratchingUpdate) => {
    const { event, canvas } = update;
    const coordinates = getMouse(event, canvas);
    set(pointAtom, coordinates);
    set(isDrawingAtom, true);
  }
);

interface ScratchingUpdate {
  event: MouseEvent | TouchEvent;
  canvas: HTMLCanvasElement;
}
export const scratchingAtom = atom(
  null,
  (get, set, update: ScratchingUpdate) => {
    const { event, canvas } = update;
    const point = get(pointAtom);

    if (get(isDrawingAtom)) {
      const context = canvas.getContext("2d");
      if (!context) return;

      const currentPoint = getMouse(event, canvas);
      const dist = computeDistance(point, currentPoint);
      const angle = computeAngle(point, currentPoint);

      let x;
      let y;

      for (let i = 0; i < dist; i += 1) {
        x = point.x + Math.sin(angle) * i - NORMALIZE;
        y = point.y + Math.cos(angle) * i - NORMALIZE;

        context.globalCompositeOperation = BLENDING_MODE;
        context.drawImage(BRUSH, x, y);
      }

      set(pointAtom, currentPoint);

      const { height, width } = canvas;
      const stride = STRIDE;
      const percentage = getPixel({ stride, context, height, width });
      set(hasFinishedAtom, percentage > THRESHOLD);
    }
  }
);
