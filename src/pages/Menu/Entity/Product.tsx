import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { atom, useAtomValue } from "jotai";
import { atomFamily } from "jotai/utils";
import styled from "@emotion/styled";

import type { Identifier, XYCoord } from "dnd-core";

import Update from "../Update";
import Delete from "../Delete";
import Like from "../Like";

import { productsAtomFamily, levelAtomFamily } from "../tree";
import Select from "../Select";

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
function ProductBody({ product }: ProductBodyProps) {
  const prices = useAtomValue(pricesAtomFamily(product));
  const isPriceSingle = prices.length === 1 && !prices[0].label;
  const { description } = product;

  if (isPriceSingle) {
    return (
      <ProductBodyContainer>
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
    <ProductBodyContainer>
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
  move: (dragIndex: number, hoverIndex: number) => void;
}
function EditableProduct({ id, order, move }: EditableProductProps) {
  const ref = useRef<HTMLDivElement>(null);

  const product = useAtomValue(productsAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(product.categoryId));

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
    >
      <Select.Product {...{ product }}>
        <ProductBody {...{ product }} />
      </Select.Product>
    </ProductContainer>
  );
}

const ProductContainer = styled("div")`
  display: flex;

  user-select: none;
  cursor: pointer;

  > &:not(:last-child) {
    margin-right: 0.25em;
  }

  &[data-is-dragging="true"] {
    opacity: 0.3;
  }
`;

export default {
  View: Product,
  Edit: EditableProduct,
};
