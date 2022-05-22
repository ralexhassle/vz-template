import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";

import { selectProductAtomFamily, toggleSelectProductAtom } from "../tree";

function Icon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
    >
      <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
    </svg>
  );
}

interface Props {
  product: API.Product;
}
function SelectProduct({ product }: Props) {
  const { isSelected } = useAtomValue(
    selectProductAtomFamily(product.productId)
  );

  const toggle = useUpdateAtom(toggleSelectProductAtom);

  const onClick = useCallback(() => {
    toggle(product);
  }, [product, toggle]);

  return (
    <Container data-is-selected={isSelected} onClick={onClick}>
      <Icon />
    </Container>
  );
}

const Container = styled("button")`
  padding: 0.25em 0.5em;

  border: none;
  border-radius: 4px;
  cursor: pointer;

  &[data-is-selected="true"] {
    color: blue;
  }

  color: #fff;
`;

export default SelectProduct;
