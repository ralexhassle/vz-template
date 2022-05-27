import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { Fragment, useCallback } from "react";

import { selectCategoryAtomFamily } from "../tree";

function Icon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="0.75em"
      width="0.75em"
    >
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
    </svg>
  );
}

interface Props {
  category: API.Category;
  children: React.ReactNode;
}
function SelectCategory({ category, children }: Props) {
  const [{ isSelected }, set] = useAtom(
    selectCategoryAtomFamily(category.categoryId)
  );

  const onClick = useCallback(() => {
    set((prev) => ({ ...prev, isSelected: !prev.isSelected }));
  }, [set]);

  return (
    <Fragment>
      <Button onClick={onClick}>
        <SelectIconContainer data-is-selected={isSelected}>
          <Icon />
        </SelectIconContainer>
      </Button>
      {children}
    </Fragment>
  );
}

const SelectIconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em;

  color: rgb(228, 224, 225);

  border-radius: 0.25em;
  box-shadow: var(--select-category);

  &[data-is-selected="true"] {
    color: var(--like-product-color);
    box-shadow: var(--unselect-category);
  }
`;

const Button = styled("button")`
  display: flex;

  padding: 0.5em 0 0.5em 0.5em;

  color: inherit;

  background: none;
  border: none;
  cursor: pointer;
`;

export default SelectCategory;
