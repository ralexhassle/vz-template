/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { Suspense, useCallback, useEffect } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtom } from "jotai";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";

import { Checkbox } from "@app/components";

import { RootEntities } from "./Entity";
import ActionButton from "./ActionButton";

import { createEntitiesAtom, isEditableAtom, menuAtom } from "./tree";

interface MenuTreeProps {
  isEditable: boolean;
}
function MenuTree({ isEditable }: MenuTreeProps) {
  const [menu] = useAtom(menuAtom);
  const createEntities = useUpdateAtom(createEntitiesAtom);

  useEffect(() => {
    createEntities(menu);
  }, [menu, createEntities]);

  return (
    <RootContainer>
      <RootEntities {...{ isEditable }} />
    </RootContainer>
  );
}

const RootContainer = styled("div")`
  display: flex;
  flex-direction: column;

  width: 100%;

  --wishlist-color: #41b9ef;

  [data-category] {
    border-radius: 0.5em;
  }

  [data-category-level="0"] {
    color: var(--wishlist-color);
  }

  [data-like="category"][data-has-likes="true"] {
    color: var(--wishlist-color);
  }

  [data-selected="category"] {
    color: var(--wishlist-color);
  }

  [data-selected="product"] {
    color: var(--wishlist-color);
  }

  [data-category-level="1"] {
    background: #606060;
    color: white;

    [data-like="product"][data-is-liked="true"] {
      color: var(--wishlist-color);
      box-shadow: inset 2px 2px 6px #4c4c4c, inset -2px -2px 6px #868686;
    }

    [data-like="product"][data-is-liked="false"] {
      color: rgb(228, 224, 225);
      box-shadow: 2px 2px 6px #4c4c4c, -2px -2px 6px #868686;
    }
  }

  [data-category-level="2"] {
    background: #f0f0f0;
    color: rgb(96, 96, 96);

    [data-like="product"][data-is-liked="true"] {
      color: var(--wishlist-color);
      box-shadow: inset 2px 2px 6px #bebebe61, inset -2px -2px 6px #ffffff;
    }

    [data-like="product"][data-is-liked="false"] {
      color: rgb(228, 224, 225);
      box-shadow: 2px 2px 6px #bebebe61, -2px -2px 6px #ffffff;
    }
  }

  [data-category-level="3"] {
    background: white;
    color: rgb(96, 96, 96);

    [data-like="product"][data-is-liked="true"] {
      color: var(--wishlist-color);
      box-shadow: inset 2px 2px 6px #bebebe61, inset -2px -2px 6px #ffffff;
    }

    [data-like="product"][data-is-liked="false"] {
      color: var(--wishlist-color);
      box-shadow: 2px 2px 6px #bebebe61, -2px -2px 6px #ffffff;
    }
  }

  > *:not(:last-child) {
    margin-bottom: 0.5em;
  }
`;

const options = {
  enableMouseEvents: true,
  delayTouchStart: 150,
};

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
        <DndProvider backend={TouchBackend} options={options}>
          <MenuTree {...{ isEditable }} />
        </DndProvider>
      </Suspense>
      <ActionButton />
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
