/* eslint-disable @typescript-eslint/no-use-before-define */
import { Fragment, useCallback } from "react";
import { useAtomValue, useAtom } from "jotai";
import styled from "@emotion/styled";

import { isEmpty } from "@app/utils";

import Create from "../Create";

import Product from "./Product";
import Category from "./Category";

import {
  selectChildrenAtomFamily,
  childrenAtomFamily,
  levelAtomFamily,
} from "../tree";

const ROOT_ENTITY_ID = Infinity;

interface RootEntitiesProps {
  isEditable: boolean;
}
/**
 * Entry point of the tree. This component is responsible for rendering the
 * root node of the tree. The root node is a special case because it has no
 * parent. Hence we create a virtual parent node with an id of `Infinity`.
 * `Infinity` is of type number as well as entity id.
 */
export function RootEntities({ isEditable }: RootEntitiesProps) {
  if (isEditable) {
    return <EditableEntities parentId={ROOT_ENTITY_ID} />;
  }

  return <Entities parentId={ROOT_ENTITY_ID} />;
}

interface EditableEntitiesProps {
  parentId: number;
}
/**
 * This container is responsible for rendering editable entities.
 * Entities are not discriminated yet. We select all sibling entities and
 * create an intermediate children atom family.
 */
function EditableEntities({ parentId }: EditableEntitiesProps) {
  const entities = useAtomValue(selectChildrenAtomFamily(parentId));
  const [children, setChildren] = useAtom(childrenAtomFamily(entities));

  const move = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setChildren((prev: APP.Child[]) => {
        const dragItem = prev[dragIndex];
        const newChildren = [...prev];
        newChildren.splice(dragIndex, 1);
        newChildren.splice(hoverIndex, 0, dragItem);
        return newChildren;
      });
    },
    [setChildren]
  );

  const renderChild = useCallback(
    (child: APP.Child, order: number) => (
      <EditableEntity key={child.id} {...{ child, order, move }} />
    ),
    [move]
  );

  if (isEmpty(children)) {
    return <EmptyEditableEntity {...{ parentId }} />;
  }

  return <Fragment>{children.map(renderChild)}</Fragment>;
}

interface EditableEntityProps {
  child: APP.Child;
  order: number;
  move: (dragIndex: number, hoverIndex: number) => void;
}
/**
 * This container is responsible for rendering an "editable" entity.
 * It also render the children if it's a category. Depending on the entity type,
 * the container will render a different entity component: a product or a category
 */
function EditableEntity({ child, order, move }: EditableEntityProps) {
  const { id, type } = child;

  if (type === "category") {
    return (
      <Category.Edit key={id} {...{ id, order, move }}>
        <EntitiesContainer>
          <EditableEntities parentId={id} />
        </EntitiesContainer>
      </Category.Edit>
    );
  }

  return <Product.Edit key={id} {...{ id, order, move }} />;
}

interface EmptyEditableEntityProps {
  parentId: number | null;
}
/**
 * When a category entity is empty, we render a create entity component.
 * If we have reached a maximum depth level (3), we must only render a
 * a create product entity component. Otherwise we have the choice to
 * create a category or a product.
 */
function EmptyEditableEntity({ parentId }: EmptyEditableEntityProps) {
  const level = useAtomValue(levelAtomFamily(parentId));
  const isMaximumLevel = level + 1 > 3;

  if (isMaximumLevel) {
    return (
      <Fragment>
        {parentId && <Create.Product categoryId={parentId} />}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Create.Category parentId={parentId} />
      {parentId && <Create.Product categoryId={parentId} />}
    </Fragment>
  );
}

interface EntitiesProps {
  parentId: number;
}
/**
 * This container is responsible for rendering entities.
 * Entities are neither discriminated yet, nor editable.
 */
function Entities({ parentId }: EntitiesProps) {
  const children = useAtomValue(selectChildrenAtomFamily(parentId));

  const renderChild = useCallback(
    (child: APP.Child, order: number) => (
      <Entity {...{ child, order }} key={child.id} />
    ),
    []
  );

  return <Fragment>{children.map(renderChild)}</Fragment>;
}

interface EntityProps {
  child: APP.Child;
  order: number;
}
/**
 * This container is responsible for rendering a "view only" entity.
 * It renders its children if it's a category. Depending on the entity type,
 * the container will render a different entity component: a product or a category
 */
export function Entity({ child, order }: EntityProps) {
  const { id, type } = child;

  if (type === "category") {
    return (
      <Category.View key={id} {...{ id, order }}>
        <EntitiesContainer>
          <Entities parentId={id} />
        </EntitiesContainer>
      </Category.View>
    );
  }

  return <Product.View key={id} {...{ id, order }} />;
}

const EntitiesContainer = styled("div")`
  display: flex;
  flex-direction: column;

  padding-top: 0;
  padding-right: 0.5em;
  padding-left: 0.5em;
  padding-bottom: 0.5em;

  > *:not(:last-child) {
    margin-bottom: 0.5em;
  }
`;

export default {
  Edit: EditableEntities,
  View: Entities,
};
