/* eslint-disable react/jsx-props-no-spreading */
import styled from "@emotion/styled";
import { forwardRef } from "react";

type BaseProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface Props extends BaseProps {
  className?: string;
}

const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Root className={className}>
      <Input ref={ref} data-textinput={rest.name} type="text" {...rest} />
    </Root>
  );
});

const Input = styled("input")`
  width: 100%;

  color: inherit;

  outline: none !important;
  border: 2px solid transparent;
  border-radius: inherit;

  &:focus {
    border: 2px solid currentColor;
    outline: none !important;
  }
`;

const Root = styled("div")`
  border-radius: 0.5em;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export default TextInput;
