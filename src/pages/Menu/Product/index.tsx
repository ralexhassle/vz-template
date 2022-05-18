/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import React, { memo } from "react";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import { productsAtomFamily } from "../tree";

interface Props {
  product: API.Product;
}
function Product(props: Props) {
  const { product } = props;
  return (
    <ProductContainer>
      <DeleteButton {...{ product }} />
      <EditButton {...{ product }} />
      {product.label}
    </ProductContainer>
  );
}

const ProductContainer = styled("div")`
  display: flex;
`;

interface OwnProps {
  productId: API.Product["productId"];
}
const withValue = (Component: React.FC<Props>) => {
  const MemoComponent = memo(Component);

  function Wrapper({ productId }: OwnProps) {
    const { value: product } = useAtomValue(productsAtomFamily(productId));
    return <MemoComponent product={product} />;
  }

  return memo(Wrapper);
};

export default withValue(Product);
