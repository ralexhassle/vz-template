import { animated, config, useSpring } from "@react-spring/web";
import styled from "@emotion/styled";

import { PORTALS } from "@constants";

import Portal from "../Portal";

function CloseIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="2em"
      width="2em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z" />
      </g>
    </svg>
  );
}

interface Props {
  message?: string;
  children?: React.ReactNode;
  dismiss: VoidFunction;
}

function Dialog({ message, children, dismiss }: Props) {
  const { scale } = useSpring<{ scale: number }>({
    scale: 1,
    from: { scale: 0.4 },
    config: config.stiff,
  });

  if (children) {
    return (
      <Portal id="dialog">
        <DialogContainer>
          <DismissButton onClick={dismiss}>
            <span>Fermer</span>
            <CloseIcon />
          </DismissButton>
          <AnimatedDialog style={{ scale }}>{children}</AnimatedDialog>
        </DialogContainer>
      </Portal>
    );
  }

  return (
    <Portal id="dialog">
      <DialogContainer>
        <DismissButton onClick={dismiss}>
          <span>Fermer</span>
        </DismissButton>
        <AnimatedDialog style={{ scale }}>
          <p>{message}</p>
        </AnimatedDialog>
      </DialogContainer>
    </Portal>
  );
}

const Button = styled("button")`
  display: flex;
  align-items: center;

  text-transform: uppercase;

  padding: 0.5em 1em;
  width: 100%;

  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DismissButton = styled(Button)`
  align-self: flex-end;

  width: auto;

  color: white;
  background: none;

  > svg {
    margin-left: 0.25em;
    color: white;
  }
`;

const DialogContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${PORTALS.DIALOG.zIndex};

  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
`;

const DialogContent = styled("div")`
  position: relative;

  width: calc(100% - 2em);
  max-height: 80vh;
  padding: 2em 1em;

  overflow-y: auto;
  border-radius: 1em;
  background: rgb(240, 240, 240);

  user-select: none;

  > h2 {
    margin-bottom: 1em;

    text-align: center;
    color: var(--color-title);
  }

  > h3 {
    margin-bottom: 1em;

    text-align: center;
    color: var(--color-title);
  }

  > p {
    text-align: center;
    color: var(--color-text);
    margin-bottom: 2em;
    white-space: pre-line;
  }
`;

const AnimatedDialog = animated(DialogContent);
export default Dialog;
