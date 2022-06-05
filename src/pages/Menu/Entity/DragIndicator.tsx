import { useEffect } from "react";
import { useBoop } from "@app/hooks";
import { animated } from "@react-spring/web";
import styled from "@emotion/styled";

function Icon() {
  return (
    <svg viewBox="0 0 6 16" fill="#41D2F2" height="1em" width="1em">
      <path d="M5.80002 12.4001C5.69393 12.294 5.55005 12.2344 5.40002 12.2344C5.24999 12.2344 5.1061 12.294 5.00001 12.4001L3.564 13.8361V2.16401L5.00001 3.60002C5.1061 3.70611 5.24999 3.76571 5.40002 3.76571C5.55005 3.76571 5.69393 3.70611 5.80002 3.60002C5.90611 3.49394 5.9657 3.35005 5.9657 3.20002C5.9657 3.04999 5.90611 2.90611 5.80002 2.80002L3.4 0.400003C3.3471 0.348363 3.28459 0.307594 3.216 0.280002C3.07767 0.222852 2.92233 0.222852 2.784 0.280002C2.71541 0.307594 2.6529 0.348363 2.6 0.400003L0.199982 2.80002C0.0938946 2.90611 0.0342955 3.04999 0.0342955 3.20002C0.0342955 3.35005 0.0938946 3.49394 0.199982 3.60002C0.306069 3.70611 0.449955 3.76571 0.599985 3.76571C0.750015 3.76571 0.8939 3.70611 0.999987 3.60002L2.436 2.16401V13.8361L0.999987 12.4001C0.8939 12.294 0.750015 12.2344 0.599985 12.2344C0.449955 12.2344 0.306069 12.294 0.199982 12.4001C0.0938946 12.5062 0.0342952 12.6501 0.0342952 12.8001C0.0342952 12.9501 0.0938946 13.094 0.199982 13.2001L2.6 15.6001C2.6529 15.6517 2.71541 15.6925 2.784 15.7201C2.92233 15.7773 3.07767 15.7773 3.216 15.7201C3.28459 15.6925 3.3471 15.6517 3.4 15.6001L5.80002 13.2001C5.90611 13.094 5.9657 12.9501 5.9657 12.8001C5.9657 12.6501 5.90611 12.5062 5.80002 12.4001Z" />
    </svg>
  );
}

function DragIndicator({ isSelected }: { isSelected: boolean }) {
  const [transform, startTrigger] = useBoop({
    y: 10,
    timing: 150,
    springConfig: {
      tension: 300,
      friction: 6,
    },
  });

  useEffect(() => {
    if (isSelected) startTrigger();
  }, [isSelected, startTrigger]);

  if (!isSelected) return null;

  return (
    <Root data-is-open={isSelected} style={{ transform }}>
      <Icon />
    </Root>
  );
}

const Root = styled(animated.div)`
  display: flex;
  align-items: center;

  padding: 0.5em;
  margin: 0 0.5em;

  color: white;
  font-weight: var(--font-bold);

  background: white;
  border: 0.25em solid #41d2f2;
  border-radius: 50%;

  cursor: grab;
`;

export default DragIndicator;
