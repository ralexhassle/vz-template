import { useCallback, useEffect } from "react";
import { useUpdateAtom } from "jotai/utils";
import styled from "@emotion/styled";

import { selectedCategoriesAtom, toggleSelectCategoryAtom } from "../tree";

function Icon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg stroke="none" fill="none" viewBox="0 0 20 20" height="1em" width="1em">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
      {isSelected && <circle cx="10" cy="10" r="5" fill="currentColor" />}
    </svg>
  );
}

interface Props {
  isSelected: boolean;
  category: API.Category;
}
function SelectCategory({ isSelected, category }: Props) {
  const toggleSelectCategory = useUpdateAtom(toggleSelectCategoryAtom);
  const setCategory = useUpdateAtom(selectedCategoriesAtom);

  const toggleSelect = useCallback(() => {
    toggleSelectCategory(category);
  }, [toggleSelectCategory, category]);

  useEffect(() => {
    setCategory((prev) => {
      const { categoryId } = category;
      if (isSelected) return { ...prev, [categoryId]: category };
      const { [categoryId]: _, ...rest } = prev;
      return rest;
    });
  }, [isSelected, setCategory, category]);

  return (
    <Button onClick={toggleSelect}>
      <SelectIconContainer data-is-selected={isSelected}>
        <Icon {...{ isSelected }} />
      </SelectIconContainer>
    </Button>
  );
}

const SelectIconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em 0 0.5em 0.5em;

  color: var(--like-product-color);

  border-radius: 0.25em;

  &[data-is-selected="true"] {
    color: var(--like-product-color);
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
