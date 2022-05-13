import { animated, config, useSpring } from "@react-spring/web";
import styled from "@emotion/styled";

import { PORTALS } from "@constants";

import Portal from "../Portal";

interface Props {
  message: string;
  dismiss: VoidFunction;
}

function Dialog({ message, dismiss }: Props) {
  const { scale } = useSpring<{ scale: number }>({
    scale: 1,
    from: { scale: 0.4 },
    config: config.stiff,
  });

  return (
    <Portal id="dialog">
      <DialogContainer>
        <AnimatedDialog style={{ scale }}>
          <p>{message}</p>
          <DismissButton onClick={dismiss}>DISMISS</DismissButton>
        </AnimatedDialog>
      </DialogContainer>
    </Portal>
  );
}

const Button = styled("button")`
  text-transform: uppercase;

  padding: 1em 2em;
  width: 100%;

  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DismissButton = styled(Button)``;

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
  width: calc(100% - 2em);
  max-width: 400px;
  max-height: 80vh;
  padding: 2em;

  overflow-y: auto;
  border-radius: 1em;
  background: white;

  user-select: none;

  > h2 {
    margin-bottom: 1em;

    text-align: center;
    color: var(--color-title);
  }

  h3 {
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
