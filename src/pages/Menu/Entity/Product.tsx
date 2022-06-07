import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { atom, useAtomValue } from "jotai";
import { atomFamily } from "jotai/utils";
import styled from "@emotion/styled";

import type { Identifier, XYCoord } from "dnd-core";

import Like from "../Like";
import Select from "../Select";
import DragIndicator from "./DragIndicator";

import {
  productsAtomFamily,
  levelAtomFamily,
  isProductSelectedAtomFamily,
  isLoadingAtomFamily,
} from "../tree";

const getFrenchPrice = (value: number) => {
  const PRICE_DECIMAL = 2;
  const PRICE_CURRENCY = "€";
  const formated = value.toFixed(PRICE_DECIMAL).replace(".", ",");
  return `${formated} ${PRICE_CURRENCY}`;
};

const filterNullPrice = (price: APIPriceType): price is PriceType =>
  price.value !== null;

interface APIPriceType {
  id: number;
  value: number | null;
  label: string | null;
}

interface PriceType {
  id: number;
  value: number;
  label: string | null;
}
/**
 * Transforming API Product prices into a PriceType array
 * and filtering out all nullish values.
 */
const pricesAtomFamily = atomFamily(
  (product: API.Product) =>
    atom<PriceType[]>(
      [
        { id: 1, value: product.price1, label: product.price1Label },
        { id: 2, value: product.price2, label: product.price2Label },
        { id: 3, value: product.price3, label: product.price3Label },
        { id: 4, value: product.price4, label: product.price4Label },
        { id: 5, value: product.price5, label: product.price5Label },
      ].filter(filterNullPrice)
    ),
  (a, b) => a.productId === b.productId
);

interface ProductPriceProps {
  value: PriceType["value"];
  label: PriceType["label"];
}
/**
 * The value of product price is a raw number hence we have to
 * formated it with its corresponding currency symbol
 */
function ProductPrice({ label, value }: ProductPriceProps) {
  return (
    <ProductPriceContainer>
      {label && <ProductPriceLabel>{label}</ProductPriceLabel>}
      <ProductPriceValue>{getFrenchPrice(value)}</ProductPriceValue>
    </ProductPriceContainer>
  );
}

const ProductPriceContainer = styled("div")`
  display: flex;
  align-self: stretch;
  justify-content: space-between;
`;

const ProductPriceLabel = styled("span")`
  font-weight: var(--font-semiBold);
`;

const ProductPriceValue = styled("span")``;

interface ProductBodyProps {
  product: API.Product;
}
/**
 * The product body layout is different depending on if the product has
 * only one price and no label associated.
 */
function ProductBody({ product }: ProductBodyProps) {
  const prices = useAtomValue(pricesAtomFamily(product));
  const isPriceSingle = prices.length === 1 && !prices[0].label;
  const { description, enabled } = product;

  if (isPriceSingle) {
    return (
      <ProductBodyContainer data-product-enabled={enabled}>
        <SingleProductContainer>
          <ProductLabel>{product.label}</ProductLabel>
          <SingleProductPricesContainer>
            {prices.map(({ id, label, value }) => (
              <ProductPrice key={id} {...{ label, value }} />
            ))}
          </SingleProductPricesContainer>
        </SingleProductContainer>
        {description && <ProductDescription>{description}</ProductDescription>}
      </ProductBodyContainer>
    );
  }

  return (
    <ProductBodyContainer data-product-enabled={enabled}>
      <ProductPricesContainer>
        <ProductLabel>{product.label}</ProductLabel>
        {description && <ProductDescription>{description}</ProductDescription>}
        {prices.map(({ id, label, value }) => (
          <ProductPrice key={id} {...{ label, value }} />
        ))}
      </ProductPricesContainer>
    </ProductBodyContainer>
  );
}

const SingleProductContainer = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const SingleProductPricesContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProductPricesContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 100%;
`;

const ProductBodyContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  flex: 1;

  &[data-product-enabled="false"] {
    opacity: 0.3;
  }
`;

const ProductLabel = styled("span")`
  font-weight: var(--font-bold);
  text-align: justify;
`;

const ProductDescription = styled("p")`
  text-align: justify;
  font-style: italic;
`;

interface ProductProps {
  id: API.Product["productId"];
}
/**
 * A product component which can be "liked". We pass the depth level
 * value to a data attribute for syle customizing purpose.
 */
function Product({ id }: ProductProps) {
  const product = useAtomValue(productsAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(product.categoryId));

  return (
    <ProductContainer data-product-level={level}>
      <Like.Product {...{ product }}>
        <ProductBody {...{ product }} />
      </Like.Product>
    </ProductContainer>
  );
}

interface EditableProductProps {
  id: API.Product["productId"];
  order: number;
  onDragEnd: (type: "product" | "category") => void;
  move: (dragIndex: number, hoverIndex: number) => void;
}
/**
 * A "editable "Product" is a node leaf in the tree. It does not
 * have any children. It can be selected, moved, updated or deleted.
 */
function EditableProduct({ id, order, move, onDragEnd }: EditableProductProps) {
  const ref = useRef<HTMLDivElement>(null);

  const product = useAtomValue(productsAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(product.categoryId));
  const { isLoading } = useAtomValue(isLoadingAtomFamily(product.categoryId));
  const isSelected = useAtomValue(
    isProductSelectedAtomFamily(product.productId)
  );

  const [{ handlerId }, drop] = useDrop<
    APP.DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "product",
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
    type: "product",
    canDrag: isSelected && !isLoading,
    end: () => onDragEnd("product"),
    item: () => ({ id, order, type: "product", parentId: product.categoryId }),
    collect: (monitor: DragSourceMonitor<APP.DragItem>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <ProductContainer
      ref={ref}
      data-handler-id={handlerId}
      data-is-dragging={isDragging}
      data-product-level={level}
      data-product-selected={isSelected}
      data-product-loading={isLoading}
    >
      <Select.Product {...{ product, isSelected, isLoading }}>
        <ProductBody {...{ product }} />
      </Select.Product>
      {!isLoading && <DragIndicator {...{ isSelected }} />}
    </ProductContainer>
  );
}

const ProductContainer = styled("div")`
  display: flex;
  align-items: center;

  user-select: none;
  cursor: pointer;
  border-radius: 0.5em;

  transition: background-color 1000ms ease-out;

  > &:not(:last-child) {
    margin-right: 0.25em;
  }

  &[data-product-selected="true"][data-is-dragging="true"] {
    background-color: #41d2f22b;
  }
`;

export default {
  View: Product,
  Edit: EditableProduct,
};
