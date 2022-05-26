/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { Suspense, useCallback, useEffect } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtom } from "jotai";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";

import { Checkbox } from "@app/components";

import { RootCategory } from "./Entity";
import { createEntitiesAtom, isEditableAtom, menuAtom } from "./tree";

function Tree() {
  const [menu] = useAtom(menuAtom);
  const createEntities = useUpdateAtom(createEntitiesAtom);

  useEffect(() => {
    createEntities(menu);
  }, [menu, createEntities]);

  return (
    <RootTreeContainer>
      <RootCategory />
    </RootTreeContainer>
  );
}

const RootTreeContainer = styled("div")`
  width: 100%;

  --wishlist-color: #41b9ef;

  --like-product-color: var(--wishlist-color);
  --like-category-color: var(--wishlist-color);

  [data-category] {
    border-radius: 0.5em;
  }

  [data-category-level="0"] {
    color: var(--wishlist-color);

    --create-category-icon: var(--wishlist-color);
    --create-category-color: var(--wishlist-color);

    --create-product-icon: var(--wishlist-color);
    --create-product-color: var(--wishlist-color);
  }

  [data-category-level="1"] {
    background: #606060;
    color: white;

    --create-category-icon: var(--wishlist-color);
    --create-category-color: white;

    --create-product-icon: var(--wishlist-color);
    --create-product-color: white;
  }

  [data-category-level="2"] {
    background: #f0f0f0;
    color: rgb(96, 96, 96);

    --create-category-icon: var(--wishlist-color);
    --create-category-color: var(--wishlist-color);

    --create-product-icon: var(--wishlist-color);
    --create-product-color: var(--wishlist-color);
  }

  [data-category-level="3"] {
    background: white;
    color: rgb(96, 96, 96);

    --create-category-icon: var(--wishlist-color);
    --create-category-color: var(--wishlist-color);

    --create-product-icon: var(--wishlist-color);
    --create-product-color: var(--wishlist-color);
  }

  > *:not(:last-child) {
    margin-bottom: 0.5em;
  }
`;

function Menu() {
  const [isEditable, toggleIsEditable] = useAtom(isEditableAtom);

  const toggle = useCallback(() => {
    toggleIsEditable((prev) => !prev);
  }, [toggleIsEditable]);

  return (
    <Root>
      <Title>Menu</Title>
      <EditableCheckbox name="edit" checked={isEditable} toggle={toggle}>
        Activer le mode édition
      </EditableCheckbox>
      <Suspense fallback="...loading">
        <DndProvider
          backend={TouchBackend}
          options={{ enableMouseEvents: true }}
        >
          <Tree />
        </DndProvider>
      </Suspense>
    </Root>
  );
}
const EditableCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
  margin-bottom: 1em;

  [data-checkmark] {
    margin-right: 0.25em;
    border: 2px solid rgb(96, 96, 96);
    border-radius: 0.25em;
    padding: 0.25em;
  }
`;
const Title = styled("h3")``;
const Root = styled("div")``;

export default Menu;
