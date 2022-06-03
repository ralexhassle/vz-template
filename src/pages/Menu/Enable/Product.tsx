import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";

import { updateProductAtom } from "../tree";

function ToggleIcon() {
  return (
    <svg viewBox="0 0 18 10" height="1em" width="1em">
      <rect width="18" height="10" rx="5" fill="currentColor" />
      <rect x="9" y="1" width="8" height="8" rx="4" fill="white" />
    </svg>
  );
}

interface Props {
  products: API.Product[];
}
function EnableProduct({ products }: Props) {
  const update = useUpdateAtom(updateProductAtom);

  const onClick = useCallback(() => {
    products.forEach((product) =>
      update({ ...product, enabled: !product.enabled })
    );
  }, [products, update]);

  return (
    <Button onClick={onClick} type="button">
      <IconContainer>
        <ToggleIcon />
      </IconContainer>
    </Button>
  );
}

const IconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  > svg {
    color: green;
  }
`;

const Button = styled("button")`
  display: flex;
  align-items: center;

  padding: 0.5em;

  color: white;
  font-weight: var(--font-bold);

  background: white;
  border: 0.25em solid green;
  border-radius: 50%;
  cursor: pointer;
`;

export default EnableProduct;
