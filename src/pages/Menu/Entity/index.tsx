/* eslint-disable @typescript-eslint/no-use-before-define */
import { Fragment, useCallback } from "react";
import { useAtomValue, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useMutation } from "react-query";

import { isEmpty } from "@app/utils";
import { client } from "@app/config";

import Create from "../Create";
import Product from "./Product";
import Category from "./Category";

import {
  getChildrenAtomFamily,
  childrenAtomFamily,
  levelAtomFamily,
  isLoadingAtomFamily,
} from "../tree";
import { toastAtom } from "../Toast/store";

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

const isCategorySiblings = (siblings: APP.Child[]) =>
  siblings.some((sibling) => sibling.type === "category");

const isProductSiblings = (siblings: APP.Child[]) =>
  siblings.some((sibling) => sibling.type === "product");

interface EditableEntitiesProps {
  parentId: number;
}
/**
 * This container is responsible for rendering editable entities.
 * Entities are not discriminated yet. We select all sibling entities and
 * create an intermediate children atom family.
 */
function EditableEntities({ parentId }: EditableEntitiesProps) {
  const setLoading = useUpdateAtom(isLoadingAtomFamily(parentId));
  const children = useAtomValue(getChildrenAtomFamily(parentId));
  const [siblings, setSiblings] = useAtom(childrenAtomFamily(children));
  const toast = useUpdateAtom(toastAtom);

  const { mutate: mutateProductOrder } = useMutation(
    [parentId],
    client.Menu.patchOrderProducts,
    {
      onSuccess: () => {
        const message = "Produit déplacé !";
        setLoading({ id: parentId, isLoading: false });
        toast({ key: String(parentId), message, type: "success" });
      },
    }
  );

  const { mutate: mutateCategoryOrder } = useMutation(
    [parentId],
    client.Menu.patchOrderProducts,
    {
      onSuccess: () => {
        const message = "Catégorie déplacée !";
        setLoading({ id: parentId, isLoading: false });
        toast({ key: String(parentId), message, type: "success" });
      },
    }
  );

  const onDragEnd = useCallback(
    (type: "product" | "category") => {
      const ordered = siblings.map(({ id, order }) => ({
        productId: id,
        order,
      }));

      if (type === "product") {
        setLoading({ id: parentId, isLoading: true });
        toast({ key: String(parentId), message: "", type: "loading" });
        return mutateProductOrder(ordered);
      }

      setLoading({ id: parentId, isLoading: true });
      toast({ key: String(parentId), message: "", type: "loading" });
      return mutateCategoryOrder(ordered);
    },
    [
      siblings,
      mutateProductOrder,
      mutateCategoryOrder,
      toast,
      parentId,
      setLoading,
    ]
  );

  const move = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setSiblings((prev: APP.Child[]) => {
        const dragItem = prev[dragIndex];
        const newChildren = [...prev];
        newChildren.splice(dragIndex, 1);
        newChildren.splice(hoverIndex, 0, dragItem);
        return newChildren.map((child, index) => ({ ...child, order: index }));
      });
    },
    [setSiblings]
  );

  const renderSibling = useCallback(
    (child: APP.Child, order: number) => (
      <EditableEntity key={child.id} {...{ child, order, move, onDragEnd }} />
    ),
    [move, onDragEnd]
  );

  if (isEmpty(siblings)) {
    return <EmptyEditableEntity {...{ parentId }} />;
  }

  return (
    <Fragment>
      {isCategorySiblings(siblings) && <Create.Category {...{ parentId }} />}
      {isProductSiblings(siblings) && <Create.Product {...{ parentId }} />}
      {siblings.map(renderSibling)}
    </Fragment>
  );
}

interface EditableEntityProps {
  child: APP.Child;
  order: number;
  onDragEnd: (type: "product" | "category") => void;
  move: (dragIndex: number, hoverIndex: number) => void;
}
/**
 * This container is responsible for rendering an "editable" entity.
 * It also render the children if it's a category. Depending on the entity type,
 * the container will render a different entity component: a product or a category
 */
function EditableEntity({
  child,
  order,
  move,
  onDragEnd,
}: EditableEntityProps) {
  const { id, type } = child;

  if (type === "category") {
    return (
      <Category.Edit key={id} {...{ id, order, move, onDragEnd }}>
        <EditableEntities parentId={id} />
      </Category.Edit>
    );
  }

  return <Product.Edit key={id} {...{ id, order, move, onDragEnd }} />;
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
      <Fragment>{parentId && <Create.Product parentId={parentId} />}</Fragment>
    );
  }

  return (
    <Fragment>
      <Create.Category parentId={parentId} />
      {parentId && <Create.Product parentId={parentId} />}
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
  const children = useAtomValue(getChildrenAtomFamily(parentId));

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
        <Entities parentId={id} />
      </Category.View>
    );
  }

  return <Product.View key={id} {...{ id, order }} />;
}

export default {
  Edit: EditableEntities,
  View: Entities,
};
