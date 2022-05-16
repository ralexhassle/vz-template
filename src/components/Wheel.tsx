import styled from "@emotion/styled";
import { animated, useSpring } from "@react-spring/web";
import { ReactNode, useCallback, useMemo, useState } from "react";

const DEFAULT_PANNEL_COUNT = 16;
const ANIMATION_DURATION_MS = 16000;
const SPIN_COUNT = 4;
const SIGMOID_COEF = 0.1;
const TWO_PIE_RAD = 360;

/**
 * We use a sigmoid function with a fine-tune coeficient
 * for decreasing the animated value gently near the end of
 * the animation duration time. We give the impression of inertia.
 *
 * @see https://www.wolframalpha.com/input/?i=plot+t%5E2+%2F+%28t%5E2+%2B+0.1*%281+-+t%29+*+%281+-+t%29%29+from+t%3D0+to+1
 */
const easing = (t: number) =>
  (t * t) / (t * t + SIGMOID_COEF * (1 - t) * (1 - t));

/**
 * Get the final index modulo a certain number of full spin
 * We want to spin the wheel a few times before showing landing
 * on the final pannel
 */
const computeIndex = (index: number, count: number) =>
  index + SPIN_COUNT * count;

const computeTheta = (count: number) => TWO_PIE_RAD / count;

const computePannelAngle = (index: number, theta: number) => theta * index;
const computeSceneAngle = (index: number, theta: number) => theta * index * -1;

const computeRadius = (size: number, count: number) =>
  Math.round(size / 2 / Math.tan(Math.PI / count));

/**
 * If we dont have enough data to populate our wheel we use a default
 * panels count which is 16 and then take a value in the given data array
 * index % data.length will always give us a value within data range
 */
const getPannels = <T,>(data: T[]): PannelType<T>[] => {
  if (data.length < DEFAULT_PANNEL_COUNT) {
    return Array.from({ length: DEFAULT_PANNEL_COUNT }, (_, index: number) => ({
      index,
      item: data[index % data.length],
    }));
  }

  return data.map((item, index) => ({ index, item }));
};

/**
 * Matrix multiplication is not commutative hence a rotation
 * then a translation is not equivalent to a translation then a
 * rotation...
 */
interface GetPannelStyleParams {
  index: number;
  theta: number;
  size: number;
  count: number;
}
function getPannelStyle({ index, theta, size, count }: GetPannelStyleParams) {
  const angle = computePannelAngle(index, theta);
  const radius = computeRadius(size, count);
  return { transform: `rotateX(${angle}deg) translateZ(${radius}px)` };
}

interface PannelProps {
  index: number;
  theta: number;
  size: number;
  count: number;
  children: ReactNode;
}
function Pannel({ index, theta, size, count, children }: PannelProps) {
  return (
    <PannelContainer style={getPannelStyle({ index, theta, size, count })}>
      {children}
    </PannelContainer>
  );
}

interface UseWheelParams<T> {
  data: T[];
  height: number;
  predicate: WheelProps<T>["predicate"];
}
const useWheel = <T,>({ data, height, predicate }: UseWheelParams<T>) => {
  const [index, setIndex] = useState(0);

  const pannels = useMemo(() => getPannels(data), [data]);
  const count = useMemo(() => pannels.length, [pannels]);
  const theta = useMemo(() => computeTheta(count), [count]);
  const angle = useMemo(() => computeSceneAngle(index, theta), [theta, index]);
  const radius = useMemo(() => computeRadius(height, count), [count, height]);
  const finalIndex = useMemo(
    () => data.findIndex(predicate),
    [predicate, data]
  );

  const rotate = useCallback(() => {
    const nextIndex = computeIndex(finalIndex, count);
    setIndex(nextIndex);
  }, [finalIndex, count]);

  return {
    index,
    angle,
    theta,
    pannels,
    radius,
    count,
    rotate,
  };
};

interface PannelType<T> {
  index: number;
  item: T;
}

interface WheelProps<T> {
  data: T[];
  height: number;
  width: number;
  className?: string | undefined;
  onFinished: () => void;
  predicate: (item: T) => boolean;
  children: (pannel: PannelType<T>) => ReactNode;
}
function Wheel<T>(props: WheelProps<T>) {
  const { data, onFinished, predicate } = props;
  const { children, height, width, className } = props;

  const wheel = useWheel({ data, height, predicate });

  const { transform } = useSpring({
    transform: `translateZ(${-wheel.radius}px) rotateX(${wheel.angle}deg)`,
    config: { easing, duration: ANIMATION_DURATION_MS },
    onRest: () => {
      if (wheel.index > 0) onFinished();
    },
  });

  return (
    <Root>
      <Container>
        <Scene
          onClick={wheel.rotate}
          className={className}
          style={{ height, width }}
        >
          <AnimatedWheel style={{ transform }}>
            {wheel.pannels.map((pannel) => (
              <Pannel
                key={pannel.index}
                index={pannel.index}
                theta={wheel.theta}
                size={height}
                count={wheel.count}
              >
                {children(pannel)}
              </Pannel>
            ))}
          </AnimatedWheel>
        </Scene>
        <ArrowContainer>
          <OuterArrow />
          <InnerArrow />
        </ArrowContainer>
      </Container>
    </Root>
  );
}

const Root = styled("div")`
  display: flex;
  justify-content: center;

  user-select: none;

  --outer-arrow-width: 38px;
  --outer-arrow-height: 12px;
  --outer-arrow-color: var(--wheel-border-color);

  --inner-arrow-width: 28px;
  --inner-arrow-height: 8px;
  --inner-arrow-color: var(--wheel-arrow-color);
`;

const Scene = styled("div")`
  position: relative;
  perspective: 300px;
  box-sizing: content-box;
`;

const WheelContainer = styled("main")`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
`;

const PannelContainer = styled("section")`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const AnimatedWheel = animated(WheelContainer);

const Arrow = styled("div")`
  position: absolute;
  right: 0;
  width: 0;
  height: 0;
`;

const OuterArrow = styled(Arrow)`
  border-top: var(--outer-arrow-height) solid transparent;
  border-bottom: var(--outer-arrow-height) solid transparent;
  border-right: var(--outer-arrow-width) solid var(--outer-arrow-color);
`;

const InnerArrow = styled(Arrow)`
  border-top: var(--inner-arrow-height) solid transparent;
  border-bottom: var(--inner-arrow-height) solid transparent;
  border-right: var(--inner-arrow-width) solid var(--inner-arrow-color);
`;

const ArrowContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  height: 400px;
  padding: 12px 12px;

  background: var(--wheel-background);
  border: 6px solid var(--wheel-border-color);
  border-radius: 16px;
`;

export default Wheel;
