import styled from "@emotion/styled";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";

import { updateCategoryAtom } from "../tree";

function ToggleIcon() {
  return (
    <svg viewBox="0 0 18 10">
      <rect width="18" height="10" rx="5" fill="currentColor" />
      <rect x="9" y="1" width="8" height="8" rx="4" fill="white" />
    </svg>
  );
}

interface Props {
  categories: API.Category[];
}
function EnableCategory({ categories }: Props) {
  const update = useUpdateAtom(updateCategoryAtom);

  const onClick = useCallback(() => {
    categories.forEach((category) =>
      update({ ...category, enabled: !category.enabled })
    );
  }, [categories, update]);

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
