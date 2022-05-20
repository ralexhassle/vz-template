/* eslint-disable @typescript-eslint/no-use-before-define */
import { memo, useCallback } from "react";
import { useAtomValue, useAtom } from "jotai";
import styled from "@emotion/styled";

import { isEmpty } from "@app/utils";

import Update from "../Update";
import Delete from "../Delete";
import Create from "../Create";

import {
  categoriesAtomFamily,
  toggleAtomFamily,
  entitiesAtomFamily,
  childrenAtomFamily,
  productsAtomFamily,
} from "../tree";

interface CategoryProps {
  category: API.Category;
  onClick: VoidFunction;
  isOpen: boolean;
}
function CategoryComponent({ category, onClick, isOpen }: CategoryProps) {
  return (
    <CategoryContainer>
      <Description>
        <Delete.Category {...{ category }} />
        <Update.Category {...{ category }} />
        <DescriptionButton onClick={onClick} type="button">
          {category.description}
        </DescriptionButton>
      </Description>
      {isOpen && <Entities parentId={category.categoryId} />}
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
`;

const DescriptionButton = styled("button")`
  border: none;
  border-radius: 4px;
  padding: 0.25em 0.5em;
  cursor: pointer;
`;

interface CategoryOwnProps {
  categoryId: API.Category["categoryId"];
}
const withCategory = (Component: React.FC<CategoryProps>) => {
  const MemoComponent = memo(Component);

  function Wrapper({ categoryId }: CategoryOwnProps) {
    const { value: category } = useAtomValue(categoriesAtomFamily(categoryId));
    const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(category.categoryId));

    const onClick = useCallback(() => {
      toggle((prev) => ({ ...prev, isOpen: !isOpen }));
    }, [isOpen, toggle]);

    return <MemoComponent {...{ category, onClick, isOpen }} />;
  }

  return memo(Wrapper);
};

const Category = withCategory(CategoryComponent);

interface EntitiesProps {
  parentId: number | null;
  entities: APP.EntityType[];
}
function EntitiesComponent({ parentId, entities }: EntitiesProps) {
  if (isEmpty(entities)) {
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
      {entities.map((entity) => (
        <Entity entity={entity} key={entity.id} />
      ))}
    </EntitiesContainer>
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

interface EntitiesOwnProps {
  parentId: number | null;
}
const withEntities = (Component: React.FC<EntitiesProps>) => {
  const MemoComponent = memo(Component);

  function Wrapper({ parentId }: EntitiesOwnProps) {
    const entities = useAtomValue(childrenAtomFamily(parentId));
    return <MemoComponent {...{ entities, parentId }} />;
  }

  return memo(Wrapper);
};

export const Entities = withEntities(EntitiesComponent);

interface ProductProps {
  product: API.Product;
}
function ProductComponent(props: ProductProps) {
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

  > *:not(:last-child) {
    margin-right: 0.25em;
  }
`;

interface ProductOwnProps {
  productId: API.Product["productId"];
}
const withProduct = (Component: React.FC<ProductProps>) => {
  const MemoComponent = memo(Component);

  function Wrapper({ productId }: ProductOwnProps) {
    const entity = useAtomValue(productsAtomFamily(productId));

    return <MemoComponent product={entity.value} />;
  }

  return memo(Wrapper);
};

const Product = withProduct(ProductComponent);

interface Props {
  entity: APP.EntityType;
}
function Entity({ entity }: Props) {
  const { type, id } = useAtomValue(entitiesAtomFamily(entity));

  if (type === "category") {
    return <Category categoryId={id} key={id} />;
  }

  if (type === "product") {
    return <Product productId={id} key={id} />;
  }

  return null;
}

export default memo(Entity);
