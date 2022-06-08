import { client } from "@app/config";
import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";
import { useCallback, useReducer } from "react";
import { useMutation } from "react-query";
import { toastAtom } from "../Toast/store";

import { isLoadingAtomFamily, updateCategoryAtom } from "../tree";

function ToggleIcon() {
  return (
    <svg viewBox="0 0 18 10">
      <rect width="18" height="10" rx="5" fill="currentColor" />
      <rect x="9" y="1" width="8" height="8" rx="4" fill="white" />
    </svg>
  );
}

function makeId(categories: API.Category[]) {
  return categories.map((category) => category.categoryId).join(",");
}

interface Props {
  categories: API.Category[];
  parentId: API.Category["parentId"];
}
function EnableCategory({ categories, parentId }: Props) {
  const setLoading = useUpdateAtom(isLoadingAtomFamily(parentId));
  const [key] = useReducer((s) => s, makeId(categories));
  const update = useUpdateAtom(updateCategoryAtom);

  const toast = useUpdateAtom(toastAtom);

  const { mutate } = useMutation([key], client.Menu.patchOrderCategories, {
    onSuccess: (data) => {
      setLoading({ id: parentId, isLoading: false });
      const message = "Produits modifiés !";
      toast({ key, message, type: "success" });
      data.forEach((category) =>
        update({ ...category, enabled: !category.enabled })
      );
    },
  });

  const onClick = useCallback(() => {
    setLoading({ id: parentId, isLoading: true });
    toast({ key, message: "Modification en cours...", type: "loading" });
    mutate(categories);
  }, [categories, setLoading, toast, parentId, key, mutate]);

  return (
    <Button onClick={onClick} type="button" data-enable="category">
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

export default EnableCategory;
