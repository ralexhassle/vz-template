import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";

export type VariantType = keyof typeof Variant;
export type SizeType = keyof typeof Size;

interface Props {
  onClick?: () => void;
  children: string;
  variant?: VariantType;
  disabled?: boolean;
  size?: SizeType;
  style?: SerializedStyles;
  type?: "button" | "reset" | "submit";
  className?: string;
}
function Pushable(props: Props) {
  const {
    onClick,
    children,
    variant = "gray",
    disabled = false,
    type,
    size = "normal",
    style,
    className,
  } = props;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      type={type}
      variant={variant}
      size={size}
      css={style}
      className={className}
    >
      <span className="edge" />
      <span className="front">{children}</span>
    </Button>
  );
}

const Variant = {
  orange: css`
    --main: hsl(32, 84%, 60%);
    --secondary: hsl(32, 84%, 50%);
    --text: white;
  `,
  red: css`
    --main: hsl(0, 53%, 59%);
    --secondary: hsl(0, 53%, 49%);
    --text: white;
  `,
  gray: css`
    --main: hsl(0, 0%, 38%);
    --secondary: hsl(0, 0%, 28%);
    --text: white;
  `,
  lightBlue: css`
    --main: hsl(204deg 63% 78%);
    --secondary: hsl(204deg, 63%, 68%);
    --text: white;
  `,
  blue: css`
    --main: hsl(199, 84%, 60%);
    --secondary: hsl(199, 84%, 50%);
    --text: white;
  `,
  violet: css`
    --main: hsl(216deg 38% 77%);
    --secondary: hsl(216deg 38% 67%);
    --text: white;
  `,
  white: css`
    --main: hsl(0, 0%, 100%);
    --secondary: hsl(0, 0%, 85%);
    --text: #606060;
  `,
  rose: css`
    --shadow: hsl(0deg 0% 0% / 0.25);
    --main: hsl(8, 62%, 66%);
    --secondary: hsl(8, 62%, 56%);
    --text: white;
  `,
  green: css`
    --main: hsl(105, 36%, 65%);
    --secondary: hsl(105, 36%, 55%);
    --text: white;
  `,
  turquoise: css`
    --main: hsl(171, 38%, 67%);
    --secondary: hsl(171, 38%, 60%);
    --text: white;
  `,
  disabled: css`
    --main: hsl(0, 0%, 38%);
    --secondary: hsl(0, 0%, 28%);
    --text: white;
  `,
};

const Size = {
  small: css`
    --padding: 10px;
    --font-size: 0.8rem;
  `,
  normal: css`
    --padding: 12px 36px;
    --font-size: 1rem;
  `,
};

const Button = styled("button")<{ variant: VariantType; size: SizeType }>`
  ${({ variant }) => Variant[variant]}
  ${({ size }) => Size[size]}

  --pushable-border-radius: 0.5em;

  position: relative;

  padding: 0;

  border: none;
  outline-offset: 4px;
  background: transparent;

  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  transition: filter 250ms;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    border-radius: var(--pushable-border-radius);
    background: var(--shadow);
    filter: blur(4px);

    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
    cursor: default;
  }

  .edge {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    border-radius: var(--pushable-border-radius);
    background: var(--secondary);
    box-shadow: var(--elevation-2);
  }

  .front {
    position: relative;
    display: block;

    padding: var(--padding);

    font-weight: var(--font-bold);
    font-size: inherit;
    color: var(--text);

    border-radius: 0.5em;
    background: var(--main);

    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  &:active:not(:disabled) .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

export default Pushable;
