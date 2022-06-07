import { useCallback, useEffect } from "react";
import { keyframes } from "@emotion/react";
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
  isLoading: boolean;
  category: API.Category;
}
function SelectCategory({ isSelected, category, isLoading }: Props) {
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

  if (isLoading) {
    return (
      <Button onClick={toggleSelect} disabled>
        <SelectIconContainer
          data-is-selected={isSelected}
          data-selected="category"
        >
          <LoaderIcon />
        </SelectIconContainer>
      </Button>
    );
  }

  return (
    <Button onClick={toggleSelect}>
      <SelectIconContainer
        data-is-selected={isSelected}
        data-selected="category"
      >
        <Icon {...{ isSelected }} />
      </SelectIconContainer>
    </Button>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderIcon = styled("div")`
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: #e0e0e0;
  border-right-color: #616161;
  animation: ${rotate} 1s linear infinite;
`;

const SelectIconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em 0 0.5em 0.5em;

  border-radius: 0.25em;
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
