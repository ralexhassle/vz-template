import { client } from "@app/config";
import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";
import { useCallback, useReducer } from "react";
import { useMutation } from "react-query";
import { toastAtom } from "../Toast/store";

import { isLoadingAtomFamily, updateProductAtom } from "../tree";

function ToggleIcon() {
  return (
    <svg viewBox="0 0 18 10">
      <rect width="18" height="10" rx="5" fill="currentColor" />
      <rect x="9" y="1" width="8" height="8" rx="4" fill="white" />
    </svg>
  );
}

function makeId(products: API.Product[]) {
  return products.map((product) => product.productId).join(",");
}

interface Props {
  products: API.Product[];
  categoryId: API.Product["categoryId"];
}
function EnableProduct({ products, categoryId }: Props) {
  const setLoading = useUpdateAtom(isLoadingAtomFamily(categoryId));
  const [key] = useReducer((s) => s, makeId(products));
  const update = useUpdateAtom(updateProductAtom);
  const toast = useUpdateAtom(toastAtom);

  const { mutate } = useMutation([key], client.Menu.patchOrderProducts, {
    onSuccess: (data) => {
      setLoading({ id: categoryId, isLoading: false });
      const message = "Produits modifiés !";
      toast({ key, message, type: "success" });
      data.forEach((product) =>
        update({ ...product, enabled: !product.enabled })
      );
    },
  });

  const onClick = useCallback(() => {
    setLoading({ id: categoryId, isLoading: true });
    toast({ key, message: "Modification en cours...", type: "loading" });
    mutate(products);
  }, [setLoading, toast, categoryId, key, mutate, products]);

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
