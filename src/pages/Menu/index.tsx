/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { Suspense, useCallback, useEffect } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtom } from "jotai";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";

import { RootCategory } from "./Entity";

import { createEntitiesAtom, isEditableAtom, menuAtom } from "./tree";
import { Checkbox } from "@app/components";

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

  [data-category-level="0"] {
    background: #606060;
    color: white;
  }

  [data-category-level="1"] {
    background: #f0f0f0;
    color: rgb(96, 96, 96);
  }

  [data-category-level="2"] {
    background: white;
    color: rgb(96, 96, 96);
  }

  > *:not(:last-child) {
    margin-bottom: 0.25em;
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
