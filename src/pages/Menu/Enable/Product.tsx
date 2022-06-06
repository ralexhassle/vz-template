import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";
import { toastAtom } from "../Toast/store";

import { updateProductAtom } from "../tree";

function ToggleIcon() {
  return (
    <svg viewBox="0 0 18 10">
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
  const toast = useUpdateAtom(toastAtom);

  const onClick = useCallback(() => {
    products.forEach((product) => {
      update({ ...product, enabled: !product.enabled });
      toast({ message: `Product ${product.label} enabled`, type: "success" });
    });
  }, [products, update, toast]);

  return (
    <Button onClick={onClick} type="button" data-enable="product">
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
    color: var(--enable-color);
    height: 1.5em;
    width: 1.5em;
  }
`;

const Button = styled("button")`
  display: flex;
  align-items: center;

  cursor: pointer;
`;

export default EnableProduct;
