/* eslint-disable @typescript-eslint/no-use-before-define */
import { Fragment, memo, useCallback, useReducer, useState } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtom, useAtomValue } from "jotai";
import styled from "@emotion/styled";

import { Dialog } from "@components";

import Product from "./Product";
import {
  categoriesAtomFamily,
  categoriesStatusFamily,
  childrenAtomFamily,
  updateCategoryAtom,
} from "./tree";

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

interface EditButtonProps {
  category: API.Category;
}
function EditButton({ category }: EditButtonProps) {
  const [isDialogOpen, toggle] = useReducer((s) => !s, false);

  return (
    <Fragment>
      <button onClick={toggle} type="button">
        editer
      </button>
      {isDialogOpen && (
        <Dialog dismiss={toggle}>
          <EditCategory {...{ category, toggle }} />
        </Dialog>
      )}
    </Fragment>
  );
}

interface EditCategoryProps {
  category: API.Category;
  toggle: VoidFunction;
}
function EditCategory({ category, toggle }: EditCategoryProps) {
  const [description, set] = useState(category.description);
  const update = useUpdateAtom(updateCategoryAtom);

  const onClick = () => {
    update({ ...category, description });
    toggle();
  };

  return (
    <Fragment>
      <input value={description} onChange={(e) => set(e.target.value)} />
      <Button onClick={onClick}>SAVE</Button>
    </Fragment>
  );
}

const Button = styled("button")`
  text-transform: uppercase;

  padding: 0.5em 1em;
  width: 100%;

  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface ChildrenProps {
  parentId: number;
}
function Children({ parentId }: ChildrenProps) {
  const [entities] = useAtom(childrenAtomFamily(parentId));

  return (
    <Fragment>
      {entities.map((entity) => {
        if (entity.type === "category") {
          return <CategoryWithValue key={entity.id} categoryId={entity.id} />;
        }

        if (entity.type === "product") {
          return <Product key={entity.id} productId={entity.id} />;
        }

        return null;
      })}
    </Fragment>
  );
}

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
