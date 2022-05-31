import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";

import { deleteProductAtom } from "../tree";

function DeleteIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
    >
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z" />
    </svg>
  );
}

interface Props {
  product: API.Product;
}
function DeleteProduct({ product }: Props) {
  const deleteProduct = useUpdateAtom(deleteProductAtom);

  const onClick = useCallback(() => {
    deleteProduct(product);
  }, [product, deleteProduct]);

  return (
    <Root>
      <Button onClick={onClick} type="button">
        <IconContainer>
          <DeleteIcon />
        </IconContainer>
      </Button>
    </Root>
  );
}

const Root = styled("div")`
  display: flex;
  flex-direction: column;
  align-self: flex-start;

  background: #ce6060;
  border-radius: 0.5em;
`;

const IconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em;

  color: inherit;

  border-radius: 0.25em;
  box-shadow: 2px 2px 6px #ce3535, -2px -2px 6px #d28b8b;
`;

const Button = styled("button")`
  display: flex;
  align-items: center;
  align-self: flex-start;

  padding: 0.5em;

  color: white;
  font-weight: var(--font-bold);

  border: none;
  background: none;
  cursor: pointer;

  > svg {
    color: white
    margin-right: 0.5em;
  }
`;

export default DeleteProduct;
