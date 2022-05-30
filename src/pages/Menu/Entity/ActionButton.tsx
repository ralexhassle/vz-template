import styled from "@emotion/styled";

import { Portal } from "@app/components";
import { PORTALS } from "@app/constants";

function Icon() {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.4,10.9h2.7v2.7c0,0.5,0.4,0.9,0.9,0.9s0.9-0.4,0.9-0.9v-2.7h2.7c0.5,0,0.9-0.4,0.9-0.9s-0.4-0.9-0.9-0.9 h-2.7V6.4c0-0.5-0.4-0.9-0.9-0.9S9.1,5.9,9.1,6.4v2.7H6.4c-0.5,0-0.9,0.4-0.9,0.9S5.9,10.9,6.4,10.9z" />
    </svg>
  );
}

interface ActionButtonProps {
  onClick: VoidFunction;
}
function ActionButton({ onClick }: ActionButtonProps) {
  return (
    <Portal id={PORTALS.ACTION.id}>
      <Container>
        <Button onClick={onClick}>
          <Icon />
        </Button>
      </Container>
    </Portal>
  );
}

export const Button = styled("div")`
  height: 3em;
  width: 3em;

  color: white;
  background-color: #ce6060;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;

  cursor: pointer;

  z-index: 999;

  > svg {
    transform: rotate(45deg);
  }
`;

const Container = styled("div")`
  position: fixed;
  right: 1em;
  bottom: 1em;
  z-index: ${PORTALS.ACTION.zIndex};

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
`;

export default ActionButton;
