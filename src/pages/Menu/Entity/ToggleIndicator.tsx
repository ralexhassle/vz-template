import styled from "@emotion/styled";

function Icon() {
  return (
    <svg viewBox="0 0 16.3 9.3" fill="currentColor">
      <path d="M8.2,6.5l6.2-6.2c0.5-0.5,1.2-0.5,1.6,0c0,0,0,0,0,0c0.5,0.5,0.5,1.2,0,1.6L9,9C8.6,9.4,7.9,9.5,7.4,9l-7-7c-0.5-0.4-0.5-1.2-0.1-1.6c0.4-0.5,1.2-0.5,1.6-0.1C2,0.3,2,0.4,2,0.4L8.2,6.5z" />
    </svg>
  );
}

function ToggleIndicator({ isOpen }: { isOpen: boolean }) {
  return (
    <Root data-is-open={isOpen}>
      <Icon />
    </Root>
  );
}

const Root = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;

  color: inherit;

  transition: transform 0.2s ease-in-out 0s;

  &[data-is-open="true"] {
    transform: rotate(180deg);
  }

  svg {
    width: 0.75em;
  }
`;

export default ToggleIndicator;
