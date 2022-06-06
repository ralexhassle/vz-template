import { useMemo } from "react";
import { useAtom } from "jotai";
import { animated, useTransition } from "@react-spring/web";
import styled from "@emotion/styled";

import { Portal } from "@app/components";
import { PORTALS } from "@app/constants";

import { toaster, ToastItem } from "./store";
import CheckmarkIcon from "./Checkmark";

const CONFIG = { tension: 125, friction: 20 };
const TIMEOUT = 4000;

function ToastManager() {
  const [toasts, setToasts] = useAtom(toaster);
  const refMap = useMemo(() => new WeakMap<ToastItem, HTMLDivElement>(), []);

  const transitions = useTransition(toasts, {
    keys: (item) => item.key,
    from: (item) => ({
      height: refMap.get(item)?.offsetHeight,
      opacity: 0,
      life: "100%",
      transform: "translate3d(0px, -25%, 0px)",
    }),
    leave: { opacity: 0, transform: "translate3d(0px, -25%, 0px)", height: 0 },
    enter: (item) => async (next) => {
      await next({
        opacity: 1,
        height: refMap.get(item)?.offsetHeight,
        transform: "translate3d(0%, 0px, 0px)",
      });

      await next({ life: "0%" });
    },
    onRest: (_result, _ctrl, item) => {
      // TODO: async toast change to success
      setToasts((state) => state.filter((i) => i.key !== item.key));
    },
    config: (_item, _index, phase) => (key) => {
      if (phase === "enter" && key === "life") return { duration: TIMEOUT };
      return CONFIG;
    },
  });

  return (
    <ToastContainer>
      {transitions((style, item) => (
        <AnimatedToast style={style}>
          <Measure ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}>
            <Toast>
              <CheckmarkIcon />
              <Message>{item.message}</Message>
            </Toast>
            <Spacer />
          </Measure>
        </AnimatedToast>
      ))}
    </ToastContainer>
  );
}

const Message = styled("p")`
  margin-left: 0.5em;
`;
const Measure = styled("div")``;
const Spacer = styled("div")`
  height: 0.75em;
`;

const ToastContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  position: fixed;
  z-index: ${PORTALS.ACTION.zIndex};
  top: 1em;
  right: 1em;

  pointer-events: none;
`;

const AnimatedToast = styled(animated.div)`
  position: relative;
`;

const Toast = styled("div")`
  display: flex;
  align-items: center;

  padding: 0.75em 1em;
  border-radius: 0.5em;

  color: rgb(96, 96, 96);
  font-size: smaller;
  font-weight: var(--font-semiBold);

  box-shadow: 0 3px 10px rgb(0 0 0 / 10%), 0 3px 3px rgb(0 0 0 / 5%);
  background: #fff;
`;

function Toaster() {
  return (
    <Portal id={PORTALS.TOAST.id}>
      <ToastManager />
    </Portal>
  );
}

export default Toaster;
