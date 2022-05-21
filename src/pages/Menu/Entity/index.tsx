/* eslint-disable @typescript-eslint/no-use-before-define */
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { useCallback, useRef } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtomValue, useAtom } from "jotai";
import { TouchBackend } from "react-dnd-touch-backend";
import styled from "@emotion/styled";

import type { Identifier, XYCoord } from "dnd-core";

import { isEmpty } from "@app/utils";

import Update from "../Update";
import Delete from "../Delete";
import Create from "../Create";

import {
  categoriesAtomFamily,
  toggleAtomFamily,
  productsAtomFamily,
  selectSiblings,
  moveProductAtom,
  moveCategoryAtom,
} from "../tree";
import Select from "../Select";

const ROOT_ID = null;
export function RootCategory() {
  const entities = useAtomValue(selectSiblings(ROOT_ID));
  return (
    <CategoryContainer>
      <Entities entities={entities} parentId={ROOT_ID} />
    </CategoryContainer>
  );
}

type DragCategory = API.Category;

interface CategoryProps {
  categoryId: API.Category["categoryId"];
}
export function Category({ categoryId }: CategoryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { value: category } = useAtomValue(categoriesAtomFamily(categoryId));
  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(categoryId));
  const entities = useAtomValue(selectSiblings(categoryId));
  const move = useUpdateAtom(moveCategoryAtom);

  const moveCategory = useCallback(
    (dragCategory: API.Category, hoverCategory: API.Category) => {
      move({ dragCategory, hoverCategory });
    },
    [move]
  );

  const onClick = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  const [{ handlerId }, drop] = useDrop<
    DragCategory,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "category",
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover: (item: DragCategory, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.order;
      const hoverIndex = category.order;

      if (dragIndex === hoverIndex) return;
      const hoverRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveCategory(item, category);
      // eslint-disable-next-line no-param-reassign
      item.order = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "category",
    item: () => category,
    collect: (monitor: DragSourceMonitor<API.Category>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <CategoryContainer
      ref={ref}
      data-handler-id={handlerId}
      data-is-dragging={isDragging}
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
        <Entities entities={entities} parentId={category.categoryId} />
      )}
    </CategoryContainer>
  );
}

const Description = styled("div")`
  display: flex;

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
  border: none;
  border-radius: 4px;
  padding: 0.25em 0.5em;
  cursor: pointer;
`;

type DragProduct = API.Product;

interface ProductProps {
  productId: API.Product["productId"];
}
function Product({ productId }: ProductProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { value: product } = useAtomValue(productsAtomFamily(productId));
  const move = useUpdateAtom(moveProductAtom);

  const moveProduct = useCallback(
    (dragProduct: API.Product, hoverProduct: API.Product) => {
      move({ dragProduct, hoverProduct });
    },
    [move]
  );

  const [{ handlerId }, drop] = useDrop<
    DragProduct,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "product",
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover: (item: DragProduct, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.order;
      const hoverIndex = product.order;

      if (dragIndex === hoverIndex) return;
      const hoverRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveProduct(item, product);
      // eslint-disable-next-line no-param-reassign
      item.order = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "product",
    item: () => product,
    collect: (monitor: DragSourceMonitor<API.Product>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <ProductContainer
      ref={ref}
      data-handler-id={handlerId}
      data-is-dragging={isDragging}
    >
      <Delete.Product {...{ product }} />
      <Update.Product {...{ product }} />
      <Select.Product {...{ product }} />
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
const ascendingOrder = (a: APP.EntityType, b: APP.EntityType) =>
  a.value.order - b.value.order;

interface EntitiesProps {
  entities: APP.EntityType[];
  parentId: number | null;
}
function Entities({ parentId, entities }: EntitiesProps) {
  if (isEmpty(entities)) {
    return (
      <EntitiesContainer>
        <Create.Category parentId={parentId} />
        {parentId && <Create.Product categoryId={parentId} />}
      </EntitiesContainer>
    );
  }

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <EntitiesContainer>
        <Create.Category parentId={parentId} />
        {parentId && <Create.Product categoryId={parentId} />}
        {entities.sort(ascendingOrder).map((entity) => {
          if (entity.type === "category") {
            return (
              <DndProvider
                key={entity.id}
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
              >
                <Category categoryId={entity.id} key={entity.id} />
              </DndProvider>
            );
          }

          return <Product productId={entity.id} key={entity.id} />;
        })}
      </EntitiesContainer>
    </DndProvider>
  );
}

const EntitiesContainer = styled("div")`
  display: flex;
  flex-direction: column;

  padding: 0.25em 0.5em;

  > *:not(:last-child) {
    margin-bottom: 0.25em;
  }
`;

export default Entities;
