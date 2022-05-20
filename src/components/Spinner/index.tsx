import { Fragment, useEffect, useState } from "react";
import { css, keyframes } from "@emotion/react";
import { useTransition, animated } from "@react-spring/web";

import { useMounted } from "@hooks";

enum STATUS {
  READY = "ready",
  SUCCESS = "success",
  LOADING = "loading",
}

const spin = keyframes`
  0% { transform: rotate(0deg) };
  100% { transform: rotate(360deg) };
`;

const animation = css`
  animation: ${spin} 1s linear infinite;
`;

const SPINNER_PATH = `
M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 
48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 
48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 
48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 
256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 
48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 
48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 
0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 
48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 
0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z
`;

const DEFAULT_SIZE = 40;

interface Props {
  isLoading: boolean;
  onSuccess?: VoidFunction;
  color?: string;
  children?: React.ReactNode;
  size?: number;
  Container?: React.ComponentType;
}
function Spinner(props: Props) {
  const {
    isLoading,
    onSuccess,
    children,
    color = "currentColor",
    size = DEFAULT_SIZE,
    Container = Fragment,
  } = props;

  const isMounted = useMounted();
  const [status, set] = useState(STATUS.READY);

  /**
   * Effect to restart the spinner when isLoading prop changes
   * status is SUCCESS only after spring is on rest
   */
  useEffect(() => {
    if (isMounted()) {
      set(STATUS.SUCCESS);
    }
  }, [isMounted]);

  /**
   * Start spring when isLoading === true
   */
  const transition = useTransition(isLoading, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 1 },
    delay: 200,
    // trail: 1000,
    onRest: () => {
      if (!isMounted()) return;
      if (status === STATUS.READY) return;
      if (status === STATUS.SUCCESS) return;
      if (status === STATUS.LOADING) {
        set(STATUS.SUCCESS);
        onSuccess?.();
      }
    },
  });

  return (
    <Fragment>
      <Container>
        {transition(
          (style, item) =>
            item && (
              <animated.svg
                data-spinner
                css={animation}
                style={{ ...style }}
                stroke={color}
                fill={color}
                strokeWidth="0"
                viewBox="0 0 512 512"
                height={size}
                width={size}
              >
                <path d={SPINNER_PATH} />
              </animated.svg>
            )
        )}
      </Container>
      {children && status === STATUS.SUCCESS && children}
    </Fragment>
  );
}

export default Spinner;
