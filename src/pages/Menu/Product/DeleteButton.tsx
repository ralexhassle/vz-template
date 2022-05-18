import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";

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

interface DeleteButtonProps {
  product: API.Product;
}
function DeleteButton({ product }: DeleteButtonProps) {
  const deleteProduct = useUpdateAtom(deleteProductAtom);

  const onClick = () => {
    deleteProduct(product);
  };

  return (
    <Button onClick={onClick} type="button">
      <DeleteIcon />
    </Button>
  );
}

const Button = styled("button")`
  padding: 0.25em 0.5em;

  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: red;
`;

export default DeleteButton;