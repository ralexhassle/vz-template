import { useEffect, useMemo } from "react";
import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { animated, SpringConfig, useTransition } from "@react-spring/web";
import styled from "@emotion/styled";

import { Portal } from "@app/components";
import { PORTALS } from "@app/constants";

import { toaster, Toast } from "./store";
import CheckmarkIcon from "./Checkmark";
import LoaderIcon from "./Loader";

const TIMEOUT = 4000;

function ToastComponent({ toast }: { toast: Toast }) {
  const setToasts = useUpdateAtom(toaster);

  useEffect(() => {
    if (toast.type === "success") {
      const timeoutId = setTimeout(() => {
        setToasts((state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([_, value]) => value.key !== toast.key
            )
          )
        );
      }, TIMEOUT);

      return () => clearTimeout(timeoutId);
    }
  }, [toast.type, toast.key, setToasts]);

  return (
    <ToastContainer>
      {toast.type === "loading" ? <LoaderIcon /> : <CheckmarkIcon />}
      <Message>
        {toast.type === "loading" ? "Chargement..." : toast.message}
      </Message>
    </ToastContainer>
  );
}

const Message = styled("p")`
  margin-left: 0.5em;
`;

const ToastContainer = styled("div")`
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

const CONFIG: SpringConfig = { tension: 125, friction: 20 };
function ToastManager() {
  const toasts = useAtomValue(toaster);
  const refMap = useMemo(() => new WeakMap<Toast, HTMLDivElement>(), []);

  const transitions = useTransition(Object.values(toasts), {
    keys: (item) => item.key,
    from: (item) => ({
      height: refMap.get(item)?.offsetHeight,
      opacity: 0,
      transform: "translate3d(0px, -25%, 0px)",
    }),
    enter: (item) => async (next) => {
      await next({
        opacity: 1,
        height: refMap.get(item)?.offsetHeight,
        transform: "translate3d(0%, 0px, 0px)",
      });
    },
    leave: { opacity: 0, transform: "translate3d(0px, -25%, 0px)", height: 0 },
    config: CONFIG,
  });

  return (
    <ToasterContainer>
      {transitions((style, toast) => (
        <AnimatedToast style={style}>
          <Measure ref={(ref: HTMLDivElement) => ref && refMap.set(toast, ref)}>
            <ToastComponent {...{ toast }} />
            <Spacer />
          </Measure>
        </AnimatedToast>
      ))}
    </ToasterContainer>
  );
}

const Measure = styled("div")``;
const Spacer = styled("div")`
  height: 0.75em;
`;

const AnimatedToast = styled(animated.div)`
  position: relative;
`;

const ToasterContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  position: fixed;
  z-index: ${PORTALS.TOAST.zIndex};
  top: 1em;
  right: 1em;

  pointer-events: none;
`;

function Toaster() {
  return (
    <Portal id={PORTALS.TOAST.id}>
      <ToastManager />
    </Portal>
  );
}

export default Toaster;
