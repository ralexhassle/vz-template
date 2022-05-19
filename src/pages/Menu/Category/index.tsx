/* eslint-disable @typescript-eslint/no-use-before-define */
import { memo, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import styled from "@emotion/styled";

import { isEmpty } from "@utils";
import {
  categoriesAtomFamily,
  categoriesStatusFamily,
  childrenAtomFamily,
} from "../tree";

import Update from "../Update";
import Product from "../Product";
import Create from "../Create";
import Delete from "../Delete";

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
        <Create.Category parentId={parentId} />
        <Create.Product categoryId={parentId} />
      </ChildrenContainer>
    );
  }

  return (
    <ChildrenContainer>
      <Create.Category parentId={parentId} />
      <Create.Product categoryId={parentId} />
      {entities.sort(ascendingOrder).map(({ id, type }) => {
        if (type === "category") {
          return <CategoryWithValue categoryId={id} key={id} />;
        }

        if (type === "product") {
          return <Product productId={id} key={id} />;
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
        <Update.Category {...{ category }} />
        <Delete.Category {...{ category }} />
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
