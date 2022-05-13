import { useMemo } from "react";
import { css } from "@emotion/react";
import { Provider } from "jotai";
import styled from "@emotion/styled";

import type { CSSInterpolation } from "@emotion/serialize";

import { Spinner } from "@components";
import { useImage } from "@hooks";

import useScratch from "./useScratch";
import useTrigger from "./useTrigger";

const SCRATCH_CARD_HEIGHT = 400;
const SCRATCH_CARD_WIDTH = 300;

interface CanvasProps {
  height: number;
  width: number;
  cover: HTMLImageElement;
  onFinished: VoidFunction;
  styles: CSSInterpolation;
}
function Canvas(props: CanvasProps) {
  const { height, width, cover, styles, onFinished } = props;
  const [ref, hasFinished] = useScratch({ cover, width, height });
  useTrigger({ isReady: hasFinished, trigger: onFinished });

  return (
    <canvas
      id="scratch-card"
      ref={ref}
      height={height}
      width={width}
      css={css(styles)}
    />
  );
}

function getStyles(hidden: string) {
  return {
    background: `url(${hidden})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 50%",
    touchAction: "none",
  };
}

interface Props {
  height: number;
  width: number;
  coverUrl: string;
  hiddenUrl: string;
  onFinished: VoidFunction;
}
function Scratch(props: Props) {
  const { height, width, coverUrl, hiddenUrl: hidden, onFinished } = props;
  const [cover, status] = useImage(coverUrl, "anonymous");
  const styles = useMemo(() => getStyles(hidden), [hidden]);

  return (
    <Spinner isLoading={status === "loading"} Container={SpinnerContainer}>
      {cover && (
        <Provider>
          <Canvas {...{ styles, height, width, cover, onFinished }} />
        </Provider>
      )}
    </Spinner>
  );
}

const SpinnerContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--color-text);

  width: ${SCRATCH_CARD_WIDTH}px;
  height: ${SCRATCH_CARD_HEIGHT}px;
`;

export default Scratch;
