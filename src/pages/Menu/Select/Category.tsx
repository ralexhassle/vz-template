import styled from "@emotion/styled";
import { useAtomValue } from "jotai";

import { selectCategoryAtomFamily } from "../tree";

function Icon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="0.5em"
      width="0.5em"
    >
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
    </svg>
  );
}

interface Props {
  category: API.Category;
}
function SelectCategory({ category }: Props) {
  const { categoryId } = category;
  const isSelected = useAtomValue(selectCategoryAtomFamily(categoryId));

  return (
    <Container data-is-selected={isSelected}>
      <Icon />
    </Container>
  );
}

const Container = styled("button")`
  padding: 0.25em 0 0.25em 0.5em;

  border: none;
  background: none;
  cursor: pointer;

  &[data-is-selected="true"] {
    color: var(--like-category-color);
    opacity: 1;
  }

  opacity: 0;
`;

export default SelectCategory;
