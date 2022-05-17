/* eslint-disable @typescript-eslint/no-use-before-define */
import { Fragment, memo, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import styled from "@emotion/styled";

import {
  categoriesAtomFamily,
  categoriesStatusFamily,
  childrenAtomFamily,
} from "../tree";

import EditButton from "./EditButton";
import Product from "../Product";

const ascendingOrder = (a: APP.EntityType, b: APP.EntityType) =>
  a.value.order - b.value.order;

interface ChildrenProps {
  parentId: number;
}
function Children({ parentId }: ChildrenProps) {
  const [entities] = useAtom(childrenAtomFamily(parentId));

  return (
    <Fragment>
      {entities.sort(ascendingOrder).map(({ id, type }) => {
        if (type === "category") {
          return <CategoryWithValue key={id} categoryId={id} />;
        }

        if (type === "product") {
          return <Product key={id} productId={id} />;
        }

        return null;
      })}
    </Fragment>
  );
}

interface Props {
  category: API.Category;
  onClick: VoidFunction;
  isOpen: boolean;
}
function Category({ category, onClick, isOpen }: Props) {
  return (
    <CategoryContainer>
      <EditButton {...{ category }} />
      <button onClick={onClick} type="button">
        {category.description}
      </button>
      {isOpen && <Children parentId={category.categoryId} />}
    </CategoryContainer>
  );
}

const CategoryContainer = styled("div")`
  padding: 0.25em 0.5em;
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
