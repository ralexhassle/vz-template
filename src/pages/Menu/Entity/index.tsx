/* eslint-disable @typescript-eslint/no-use-before-define */
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { Fragment, useCallback, useRef } from "react";
import { useAtomValue, useAtom } from "jotai";
import styled from "@emotion/styled";

import type { Identifier, XYCoord } from "dnd-core";

import { isEmpty } from "@app/utils";

import Update from "../Update";
import Delete from "../Delete";
import Create from "../Create";
import Like from "../Like";

import Product from "./Product";
import ToggleIndicator from "./ToggleIndicator";

import {
  categoriesAtomFamily,
  toggleAtomFamily,
  selectChildrenAtomFamily,
  childrenAtomFamily,
  levelAtomFamily,
  isEditableAtom,
} from "../tree";

const ROOT_ENTITY_ID = Infinity;
export function RootCategory() {
  const children = useAtomValue(selectChildrenAtomFamily(ROOT_ENTITY_ID));
  const isEditable = useAtomValue(isEditableAtom);

  if (isEditable) {
    return <EditableEntities entities={children} parentId={null} />;
  }

  return <Entities entities={children} />;
}

interface EditableEntitiesProps {
  entities: APP.EntityType["children"];
  parentId: number | null;
}
function EditableEntities({ parentId, entities }: EditableEntitiesProps) {
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
    (child: APP.Child, order: number) => {
      const { id, type } = child;
      if (type === "category") {
        return <Category.Edit key={id} {...{ id, order, move }} />;
      }

      return <Product.Edit key={id} {...{ id, order, move }} />;
    },
    [move]
  );

  if (isEmpty(children)) {
    return (
      <Fragment>
        <Create.Category parentId={parentId} />
        {parentId && <Create.Product categoryId={parentId} />}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Create.Category parentId={parentId} />
      {parentId && <Create.Product categoryId={parentId} />}
      {children.map(renderChild)}
    </Fragment>
  );
}

interface EntitiesProps {
  entities: APP.EntityType["children"];
}
function Entities({ entities }: EntitiesProps) {
  const [children] = useAtom(childrenAtomFamily(entities));

  const renderChild = useCallback((child: APP.Child, order: number) => {
    const { id, type } = child;
    if (type === "category") {
      return <Category.View key={id} {...{ id, order }} />;
    }

    return <Product.View key={id} {...{ id, order }} />;
  }, []);

  return <Fragment>{children.map(renderChild)}</Fragment>;
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

interface CategoryProps {
  id: API.Category["categoryId"];
}
export function CategoryView({ id }: CategoryProps) {
  const category = useAtomValue(categoriesAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(category.categoryId));

  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(id));
  const children = useAtomValue(selectChildrenAtomFamily(id));

  const onClick = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  return (
    <CategoryContainer data-category-level={level} data-category>
      <CategorHeader>
        <ToggleButton onClick={onClick} type="button">
          <Like.Category {...{ category }} />
          <Description>{category.description}</Description>
          <ToggleIndicator isOpen={isOpen} />
        </ToggleButton>
      </CategorHeader>
      {isOpen && (
        <EntitiesContainer>
          <Entities entities={children} />
        </EntitiesContainer>
      )}
    </CategoryContainer>
  );
}

interface EditableCategoryProps {
  id: API.Category["categoryId"];
  order: number;
  move: (dragIndex: number, hoverIndex: number) => void;
}
export function EditableCategory({ id, order, move }: EditableCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const category = useAtomValue(categoriesAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(category.categoryId));

  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(id));
  const children = useAtomValue(selectChildrenAtomFamily(id));

  const onClick = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  const [{ handlerId }, drop] = useDrop<
    APP.DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: String(category.parentId),
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover: (item: APP.DragItem, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.order;
      const hoverIndex = order;

      if (dragIndex === hoverIndex) return;
      const hoverRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      move(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      item.order = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: String(category.parentId),
    item: () => ({ id, order, type: "category" }),
    collect: (monitor: DragSourceMonitor<APP.DragItem>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <CategoryContainer
      ref={ref}
      data-handler-id={handlerId}
      data-is-dragging={isDragging}
      data-category-level={level}
      data-category
    >
      <CategorHeader>
        {/* <Delete.Category {...{ category }} />
        <Update.Category {...{ category }} /> */}
        <ToggleButton onClick={onClick} type="button">
          <Description>{category.description}</Description>
          <ToggleIndicator isOpen={isOpen} />
        </ToggleButton>
      </CategorHeader>
      {isOpen && (
        <EntitiesContainer>
          <EditableEntities
            entities={children}
            parentId={category.categoryId}
          />
        </EntitiesContainer>
      )}
    </CategoryContainer>
  );
}

const ToggleButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  padding: 0.75em;

  color: inherit;

  background: none;
  border: none;
  cursor: pointer;
`;

const Description = styled("span")`
  flex: 1;

  font-weight: var(--font-bold);
  text-align: start;
`;

const CategorHeader = styled("div")`
  display: flex;

  color: inherit;

  > *:not(:last-child) {
    margin-right: 0.25em;
  }
`;

const CategoryContainer = styled("div")`
  display: flex;
  flex-direction: column;

  &[data-is-dragging="true"] {
    opacity: 0.5;
  }
`;

const Category = {
  View: CategoryView,
  Edit: EditableCategory,
};

export default Entities;
