/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import React, { memo } from "react";

import { productsAtomFamily } from "../tree";
import Delete from "../Delete";
import Update from "../Update";

interface Props {
  product: API.Product;
}
function Product(props: Props) {
  const { product } = props;
  return (
    <ProductContainer>
      <Delete.Product {...{ product }} />
      <Update.Product {...{ product }} />
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
