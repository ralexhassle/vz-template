export interface Vector {
  x: number;
  y: number;
}

export function computeDistance(point1: Vector, point2: Vector) {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
}

export function computeAngle(point1: Vector, point2: Vector) {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

export function computePercentage(value: number, total: number) {
  return Math.round((value / total) * 100);
}

interface Params {
  stride: number;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
}
export function getPixel(params: Params) {
  const { context, width, height } = params;
  const stride = params.stride < 1 ? 1 : params.stride;

  const pixels: ImageData = context.getImageData(0, 0, width, height);
  const pixelData: Uint8ClampedArray = pixels.data;
  const { length } = pixelData;
  const total = length / stride;
  let count = 0;

  for (let i = 0; i < length; i += stride) {
    if (pixelData[i] === 0) {
      count += 1;
    }
  }

  return computePercentage(count, total);
}

// Firefox and Safari specific
function isTouchEvent(
  event?: EventType
): event is TouchEvent | React.TouchEvent {
  return event != null && "changedTouches" in event;
}

export function getMouse(
  event: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
): Vector {
  let offsetLeft = 0;
  let offsetTop = 0;

  const bounds: DOMRect = canvas.getBoundingClientRect();
  offsetLeft = bounds.left;
  offsetTop = bounds.top;

  if (isTouchEvent(event)) {
    const mouseX = event.touches[0].clientX - offsetLeft;
    const mouseY = event.touches[0].clientY - offsetTop;
    return { x: mouseX, y: mouseY };
  }

  const mouseX = event.pageX - offsetLeft - window.scrollX;
  const mouseY = event.pageY - offsetTop - window.scrollY;
  return { x: mouseX, y: mouseY };
}

export type EventType =
  | MouseEvent
  | TouchEvent
  | React.MouseEvent
  | React.TouchEvent;
