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
      viewBox="0 0 12 14"
      height="1em"
      width="1em"
    >
      <path d="M9.11673 14H2.88327C1.72364 14 0.778909 13.1148 0.778909 12.026V4.12785C0.778909 3.83062 1.02327 3.58938 1.32436 3.58938H10.6756C10.9767 3.58938 11.2211 3.83062 11.2211 4.12785V12.0249C11.2211 13.1137 10.2775 13.9989 9.11673 13.9989V14ZM1.86982 4.66631V12.0249C1.86982 12.5192 2.32473 12.922 2.88327 12.922H9.11673C9.67527 12.922 10.1302 12.5192 10.1302 12.0249V4.66631H8.07273C8.09345 4.72231 8.10327 4.78262 8.10327 4.84615V10.5894C8.10327 10.8866 7.85891 11.1278 7.55782 11.1278C7.25673 11.1278 7.01236 10.8866 7.01236 10.5894V4.84615C7.01236 4.78262 7.02327 4.72339 7.04291 4.66631H4.95491C4.97564 4.72231 4.98545 4.78262 4.98545 4.84615V10.5894C4.98545 10.8866 4.74109 11.1278 4.44 11.1278C4.13891 11.1278 3.89455 10.8866 3.89455 10.5894V4.84615C3.89455 4.78262 3.90545 4.72339 3.92509 4.66631H1.86982ZM11.4545 2.51246H0.545455C0.244364 2.51246 0 2.27123 0 1.974C0 1.67677 0.244364 1.43554 0.545455 1.43554H11.4545C11.7556 1.43554 12 1.67677 12 1.974C12 2.27123 11.7556 2.51246 11.4545 2.51246ZM8.33782 1.07692H3.66218C3.36109 1.07692 3.11673 0.835692 3.11673 0.538462C3.11673 0.241231 3.36109 0 3.66218 0H8.33782C8.63891 0 8.88327 0.241231 8.88327 0.538462C8.88327 0.835692 8.63891 1.07692 8.33782 1.07692V1.07692Z" />
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
    <Button onClick={onClick} type="button">
      <IconContainer>
        <DeleteIcon />
      </IconContainer>
    </Button>
  );
}

const IconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  > svg {
    color: red;
  }
`;

const Button = styled("button")`
  display: flex;
  align-items: center;

  padding: 0.5em;

  color: white;
  font-weight: var(--font-bold);

  background: white;
  border: 0.25em solid red;
  border-radius: 50%;
  cursor: pointer;
`;

export default DeleteProduct;
