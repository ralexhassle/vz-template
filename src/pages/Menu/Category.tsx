/* eslint-disable @typescript-eslint/no-use-before-define */
import { Fragment, memo, useReducer, useState } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtom } from "jotai";
import styled from "@emotion/styled";

import { Dialog } from "@components";

import Product from "./Product";
import {
  categoriesAtomFamily,
  childrenAtomFamily,
  updateEntityAtom,
} from "./tree";

interface CategoryProps {
  category: API.Category;
}
function Category(props: CategoryProps) {
  const { category } = props;

  const [isDialogOpen, toggle] = useReducer((s) => !s, false);

  const [{ isOpen }, toggleCategory] = useAtom(categoriesAtomFamily(category));

  const onClick = () => {
    toggleCategory((prev) => ({ ...prev, isOpen: !isOpen }));
  };

  return (
    <CategoryContainer>
      <button onClick={toggle} type="button">
        editer
      </button>
      <button onClick={onClick} type="button">
        {category.description}
      </button>
      {isOpen && <Children parentId={category.categoryId} />}
      {isDialogOpen && (
        <Dialog dismiss={toggle}>
          <EditCategory category={category} />
        </Dialog>
      )}
    </CategoryContainer>
  );
}

const CategoryContainer = styled("div")`
  padding: 0.25em 0.5em;
`;

interface CategoryProps {
  category: API.Category;
}
function EditCategory({ category }: CategoryProps) {
  const [description, set] = useState(category.description);
  const update = useUpdateAtom(updateEntityAtom);

  const onClick = () => {
    update({
      type: "update/category/description",
      payload: {
        id: category.categoryId,
        description,
      },
    });
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
          return <Category key={entity.id} category={entity.value} />;
        }

        if (entity.type === "product") {
          return <Product key={entity.id} product={entity.value} />;
        }

        return null;
      })}
    </Fragment>
  );
}

export default Category;
