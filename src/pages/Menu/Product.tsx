/* eslint-disable @typescript-eslint/no-use-before-define */
import { Dialog } from "@app/components";
import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React, { Fragment, memo, useReducer, useState } from "react";

import { productsAtomFamily, updateProductAtom } from "./tree";

interface Props {
  product: API.Product;
}
function Product(props: Props) {
  const { product } = props;
  return (
    <ProductContainer>
      <EditButton {...{ product }} />
      {product.label}
    </ProductContainer>
  );
}

const ProductContainer = styled("div")`
  padding: 0.25em 0.5em;
`;

interface EditButtonProps {
  product: API.Product;
}
function EditButton({ product }: EditButtonProps) {
  const [isDialogOpen, toggle] = useReducer((s) => !s, false);

  return (
    <Fragment>
      <button onClick={toggle} type="button">
        editer
      </button>
      {isDialogOpen && (
        <Dialog dismiss={toggle}>
          <EditProduct {...{ product, toggle }} />
        </Dialog>
      )}
    </Fragment>
  );
}

interface EditProductProps {
  product: API.Product;
  toggle: VoidFunction;
}
function EditProduct({ product, toggle }: EditProductProps) {
  const [label, set] = useState(product.label);
  const update = useUpdateAtom(updateProductAtom);

  const onClick = () => {
    update({ ...product, label });
    toggle();
  };

  return (
    <Fragment>
      <input value={label} onChange={(e) => set(e.target.value)} />
      <Button onClick={onClick}>SAVE</Button>
    </Fragment>
  );
}

const Button = styled("button")`
  text-transform: uppercase;

  padding: 0.5em 1em;
  width: 100%;

  border: none;
  border-radius: 4px;
  cursor: pointer;
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
