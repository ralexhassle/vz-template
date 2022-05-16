/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";

interface ProductProps {
  product: API.Product;
}
function Product(props: ProductProps) {
  const { product } = props;

  return <ProductContainer>{product.label}</ProductContainer>;
}

const ProductContainer = styled("div")`
  padding: 0.25em 0.5em;
`;

export default Product;
