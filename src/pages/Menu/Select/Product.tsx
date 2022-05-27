import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useCallback } from "react";

import { selectProductAtomFamily } from "../tree";

function Icon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="0.75em"
      width="0.75em"
    >
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
    </svg>
  );
}

interface Props {
  product: API.Product;
  children: React.ReactNode;
}
function SelectProduct({ product, children }: Props) {
  const [{ isSelected }, set] = useAtom(
    selectProductAtomFamily(product.productId)
  );

  const onClick = useCallback(() => {
    set((prev) => ({ ...prev, isSelected: !prev.isSelected }));
  }, [set]);

  return (
    <Button onClick={onClick}>
      <SelectIconContainer data-is-selected={isSelected}>
        <Icon />
      </SelectIconContainer>
      {children}
    </Button>
  );
}

const SelectIconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em;
  margin-right: 0.5em;

  color: rgb(228, 224, 225);

  border-radius: 0.25em;
  box-shadow: var(--select-product);

  &[data-is-selected="true"] {
    color: var(--like-product-color);
    box-shadow: var(--unselect-product);
  }
`;

const Button = styled("button")`
  display: flex;
  flex: 1;

  padding: 0;

  color: inherit;

  background: none;
  border: none;
  cursor: pointer;
`;

export default SelectProduct;
