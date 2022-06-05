import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";
import { useCallback, useEffect } from "react";

import { selectedProductsAtom, toggleSelectProductAtom } from "../tree";

function Icon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg stroke="none" fill="none" viewBox="0 0 20 20" height="1em" width="1em">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
      {isSelected && <circle cx="10" cy="10" r="5" fill="currentColor" />}
    </svg>
  );
}

interface Props {
  isSelected: boolean;
  product: API.Product;
  children: React.ReactNode;
}
function SelectProduct({ product, isSelected, children }: Props) {
  const toggleProduct = useUpdateAtom(toggleSelectProductAtom);
  const setProduct = useUpdateAtom(selectedProductsAtom);

  const toggleSelect = useCallback(() => {
    toggleProduct(product);
  }, [toggleProduct, product]);

  useEffect(() => {
    setProduct((prev) => {
      const { productId } = product;
      if (isSelected) return { ...prev, [productId]: product };
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  }, [isSelected, setProduct, product]);

  return (
    <Button onClick={toggleSelect}>
      <SelectIconContainer
        data-is-selected={isSelected}
        data-selected="product"
      >
        <Icon {...{ isSelected }} />
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

  border-radius: 0.25em;
`;

const Button = styled("button")`
  display: flex;
  align-items: center;
  flex: 1;

  padding: 0;

  color: inherit;

  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &[data-is-selected="true"] {
    cursor: grab;
  }
`;

export default SelectProduct;
