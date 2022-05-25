/* eslint-disable @typescript-eslint/no-use-before-define */
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { useCallback, useRef } from "react";
import { useAtomValue, useAtom } from "jotai";
import styled from "@emotion/styled";

import type { Identifier, XYCoord } from "dnd-core";

import { isEmpty } from "@app/utils";

import Update from "../Update";
import Delete from "../Delete";
import Create from "../Create";
import Select from "../Select";

import {
  categoriesAtomFamily,
  toggleAtomFamily,
  productsAtomFamily,
  selectChildrenAtomFamily,
  childrenAtomFamily,
  levelAtomFamily,
  isEditableAtom,
} from "../tree";

const ROOT_ID = Infinity;
export function RootCategory() {
  const children = useAtomValue(selectChildrenAtomFamily(ROOT_ID));
  const isEditable = useAtomValue(isEditableAtom);

  if (isEditable) {
    return (
      <CategoryContainer>
        <EditableEntities entities={children} parentId={null} />
      </CategoryContainer>
    );
  }

  return (
    <CategoryContainer>
      <Entities entities={children} />
    </CategoryContainer>
  );
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
        return <EditableCategory key={id} {...{ id, order, move }} />;
      }

      return <EditableProduct key={id} {...{ id, order, move }} />;
    },
    [move]
  );

  if (isEmpty(children)) {
    return (
      <EntitiesContainer>
        <Create.Category parentId={parentId} />
        {parentId && <Create.Product categoryId={parentId} />}
      </EntitiesContainer>
    );
  }

  return (
    <EntitiesContainer>
      <Create.Category parentId={parentId} />
      {parentId && <Create.Product categoryId={parentId} />}
      {children.map(renderChild)}
    </EntitiesContainer>
  );
}

interface EntitiesProps {
  entities: APP.EntityType["children"];
}
function Entities({ entities }: EntitiesProps) {
  const [children] = useAtom(childrenAtomFamily(entities));

  const renderChild = useCallback((child: APP.Child, order: number) => {
    const { id, type } = child;
    if (type === "category") return <Category key={id} {...{ id, order }} />;
    return <Product key={id} {...{ id, order }} />;
  }, []);

  return <EntitiesContainer>{children.map(renderChild)}</EntitiesContainer>;
}

const EntitiesContainer = styled("div")`
  display: flex;
  flex-direction: column;

  padding: 0.25em;

  > *:not(:last-child) {
    margin-bottom: 0.25em;
  }
`;

interface CategoryProps {
  id: API.Category["categoryId"];
}
export function Category({ id }: CategoryProps) {
  const category = useAtomValue(categoriesAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(category.parentId));

  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(id));
  const children = useAtomValue(selectChildrenAtomFamily(id));

  const onClick = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  return (
    <CategoryContainer data-category-level={level}>
      <Description>
        <Select.Category {...{ category }} />
        <DescriptionButton onClick={onClick} type="button">
          {category.description}
        </DescriptionButton>
      </Description>
      {isOpen && <Entities entities={children} />}
    </CategoryContainer>
  );
}

type DragItem = {
  id: number;
  order: number;
  type: string;
};

interface EditableCategoryProps {
  id: API.Category["categoryId"];
  order: number;
  move: (dragIndex: number, hoverIndex: number) => void;
}
export function EditableCategory({ id, order, move }: EditableCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const category = useAtomValue(categoriesAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(category.parentId));

  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(id));
  const children = useAtomValue(selectChildrenAtomFamily(id));

  const onClick = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: String(category.parentId),
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover: (item: DragItem, monitor) => {
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
    collect: (monitor: DragSourceMonitor<DragItem>) => ({
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
    >
      <Description>
        <Delete.Category {...{ category }} />
        <Update.Category {...{ category }} />
        <Select.Category {...{ category }} />
        <DescriptionButton onClick={onClick} type="button">
          {category.description}
        </DescriptionButton>
      </Description>
      {isOpen && (
        <EditableEntities entities={children} parentId={category.categoryId} />
      )}
    </CategoryContainer>
  );
}

const Description = styled("div")`
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

const DescriptionButton = styled("button")`
  flex: 1;

  color: inherit;
  text-align: start;

  border: none;
  background: none;
  border-radius: 4px;
  padding: 0.25em 0.5em 0.25em 0;
  cursor: pointer;
`;

interface ProductProps {
  id: API.Product["productId"];
}
function Product({ id }: ProductProps) {
  const product = useAtomValue(productsAtomFamily(id));

  return (
    <ProductContainer
    // data-product-level={entity.ancestors.length}
    >
      <Select.Product {...{ product }} />
      {product.label}
    </ProductContainer>
  );
}

interface EditableProductProps {
  id: API.Product["productId"];
  order: number;
  move: (dragIndex: number, hoverIndex: number) => void;
}
function EditableProduct({ id, order, move }: EditableProductProps) {
  const ref = useRef<HTMLDivElement>(null);

  const product = useAtomValue(productsAtomFamily(id));

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "product",
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover: (item: DragItem, monitor) => {
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
    type: "product",
    item: () => ({ id, order, type: "product", parentId: product.categoryId }),
    collect: (monitor: DragSourceMonitor<DragItem>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <ProductContainer
      ref={ref}
      data-handler-id={handlerId}
      data-is-dragging={isDragging}
      // data-product-level={entity.ancestors.length}
    >
      <Select.Product {...{ product }} />
      <Delete.Product {...{ product }} />
      <Update.Product {...{ product }} />
      {product.label}
    </ProductContainer>
  );
}

const ProductContainer = styled("div")`
  display: flex;

  user-select: none;
  cursor: pointer;

  > *:not(:last-child) {
    margin-right: 0.25em;
  }

  &[data-is-dragging="true"] {
    opacity: 0.5;
  }
`;

export default Entities;
