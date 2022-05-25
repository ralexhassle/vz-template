import styled from "@emotion/styled";
import { ReactNode } from "react";

const CHECKMARK_PATH = `
M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 
0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 
0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 
36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 
36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z
`;

interface CheckboxProps {
  name: string;
  children: ReactNode;
  checked: boolean;
  toggle: VoidFunction;
  className?: string;
}
function Checkbox({
  name,
  checked,
  children,
  toggle,
  className,
}: CheckboxProps) {
  return (
    <Label htmlFor={name} className={className}>
      <input
        id={name}
        style={{ display: "none" }}
        type="checkbox"
        checked={checked}
        onChange={toggle}
      />
      <CheckmarkContainer data-checkmark={checked}>
        <svg
          data-checkmark-icon
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
        >
          {checked && <path d={CHECKMARK_PATH} />}
        </svg>
      </CheckmarkContainer>
      <span>{children}</span>
    </Label>
  );
}

const Label = styled("label")``;
const CheckmarkContainer = styled("div")``;

export default Checkbox;
