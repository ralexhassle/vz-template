import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";

import { likeProductAtomFamily, toggleLikeProductAtom } from "../tree";

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
  children: React.ReactNode;
}
function LikeProduct({ product, children }: Props) {
  const toggle = useUpdateAtom(toggleLikeProductAtom);
  const { isSelected } = useAtomValue(likeProductAtomFamily(product.productId));

  const onClick = useCallback(() => {
    toggle(product);
  }, [product, toggle]);

  return (
    <Button onClick={onClick}>
      <LikeIconContainer data-is-selected={isSelected}>
        <Icon />
      </LikeIconContainer>
      {children}
    </Button>
  );
}

const LikeIconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em;
  margin-right: 0.5em;

  color: rgb(228, 224, 225);

  border-radius: 0.25em;
  box-shadow: var(--like-product);

  &[data-is-selected="true"] {
    color: var(--like-product-color);
    box-shadow: var(--unlike-product);
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

export default LikeProduct;
