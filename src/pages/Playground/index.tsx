/* eslint-disable @typescript-eslint/no-use-before-define */
import { useBoop } from "@app/hooks";
import styled from "@emotion/styled";
import { animated } from "@react-spring/web";

const useAngledBoop = (index: number) => {
  const angle = index * (360 / 3) - 90;
  const angleInRads = (angle * Math.PI) / 180;
  const distance = 42;
  const x = distance * Math.cos(angleInRads);
  const y = distance * Math.sin(angleInRads);
  let timing = normalize(index, 0, 4, 450, 600);
  timing *= 1 + index * 0.22;
  const friction = normalize(index, 0, 4, 15, 40);
  const boop = useBoop({
    x,
    y,
    timing,
    scale: 1.4,
    springConfig: { tension: 180, friction },
  });
  return boop;
};

function CircleDemo() {
  const [c1s, c1t] = useAngledBoop(0);
  const [c2s, c2t] = useAngledBoop(1);
  const [c3s, c3t] = useAngledBoop(2);
  // const [c4s, c4t] = useAngledBoop(3);
  // const [c5s, c5t] = useAngledBoop(4);
  const [starStyles, starTrigger] = useBoop({
    scale: 1.1,
    rotation: 10,
    timing: 150,
    springConfig: {
      tension: 300,
      friction: 6,
    },
  });
  return (
    <Wrapper>
      <Button
        onMouseEnter={() => {
          c1t();
          c2t();
          c3t();
          starTrigger();
        }}
      >
        <IconWrapper style={{ transform: starStyles }}>
          <Star />
        </IconWrapper>
      </Button>
      <Circle style={{ transform: c1s }} />
      <Circle style={{ transform: c2s }} />
      <Circle style={{ transform: c3s }} />
    </Wrapper>
  );
}
// This helper function is used in the component
const normalize = (
  subject: number,
  currentScaleMin: number,
  currentScaleMax: number,
  newScaleMin = 0,
  newScaleMax = 1
) => {
  // FIrst, normalize the value between 0 and 1.
  const standardNormalization =
    (subject - currentScaleMin) / (currentScaleMax - currentScaleMin);
  // Next, transpose that value to our desired scale.
  return (newScaleMax - newScaleMin) * standardNormalization + newScaleMin;
};

const Star = styled("span")`
  width: 40px;
  height: 40px;
  background: red;
  border-radius: 50%;
`;

const Wrapper = styled.div`
  position: relative;
  width: min-content;
`;
const Button = styled("button")`
  position: relative;
  z-index: 3;
  padding: 8px;
  border-radius: 50%;
`;
const IconWrapper = styled(animated.span)`
  display: block;
  svg {
    display: block;
    stroke: var(--color-text) !important;
    fill: var(--color-background) !important;
  }
`;
const Circle = styled(animated.div)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 8px;
  height: 8px;
  margin: auto;
  border-radius: 50%;
  background: hsl(50deg, 100%, 48%);
`;

function Page() {
  return (
    <RootPage>
      <CircleDemo />
    </RootPage>
  );
}

const RootPage = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;
`;

export default Page;
