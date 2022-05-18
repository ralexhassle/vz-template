/* eslint-disable @typescript-eslint/no-use-before-define */
import { Fragment, memo, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import styled from "@emotion/styled";

import { isEmpty } from "@utils";
import {
  categoriesAtomFamily,
  categoriesStatusFamily,
  childrenAtomFamily,
} from "../tree";

import EditButton from "./EditButton";
import Product from "../Product";
import AddProduct from "../Product/AddButton";
import AddCategory from "./AddButton";

const ascendingOrder = (a: APP.EntityType, b: APP.EntityType) =>
  a.value.order - b.value.order;

interface ChildrenProps {
  parentId: number;
}
function Children({ parentId }: ChildrenProps) {
  const [entities] = useAtom(childrenAtomFamily(parentId));

  if (isEmpty(entities)) {
    return (
      <ChildrenContainer>
        <AddCategory parentId={parentId} />
        <AddProduct categoryId={parentId} />
      </ChildrenContainer>
    );
  }

  return (
    <ChildrenContainer>
      {entities.sort(ascendingOrder).map(({ id, type }, index) => {
        if (type === "category") {
          return (
            <Fragment key={id}>
              {index === 0 && <AddCategory parentId={parentId} />}
              <CategoryWithValue categoryId={id} />
            </Fragment>
          );
        }

        if (type === "product") {
          return (
            <Fragment key={id}>
              {index === 0 && <AddProduct categoryId={parentId} />}
              <Product productId={id} />
            </Fragment>
          );
        }

        return null;
      })}
    </ChildrenContainer>
  );
}

const ChildrenContainer = styled("div")`
  display: flex;
  flex-direction: column;

  padding: 0.25em 0.5em;
`;

interface Props {
  category: API.Category;
  onClick: VoidFunction;
  isOpen: boolean;
}
function Category({ category, onClick, isOpen }: Props) {
  return (
    <CategoryContainer>
      <Description>
        <EditButton {...{ category }} />
        <button onClick={onClick} type="button">
          {category.description}
        </button>
      </Description>
      {isOpen && <Children parentId={category.categoryId} />}
    </CategoryContainer>
  );
}

const Description = styled("div")`
  display: flex;
`;

const CategoryContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

interface OwnProps {
  categoryId: API.Category["categoryId"];
}
const withValue = (Component: React.FC<Props>) => {
  const MemoComponent = memo(Component);

  function Wrapper({ categoryId }: OwnProps) {
    const { value: category } = useAtomValue(categoriesAtomFamily(categoryId));

    const [{ isOpen }, toggleCategory] = useAtom(
      categoriesStatusFamily(category.categoryId)
    );

    const onClick = useCallback(() => {
      toggleCategory((prev) => ({ ...prev, isOpen: !isOpen }));
    }, [isOpen, toggleCategory]);

    return (
      <MemoComponent category={category} onClick={onClick} isOpen={isOpen} />
    );
  }

  return memo(Wrapper);
};

const CategoryWithValue = withValue(Category);

export default CategoryWithValue;
