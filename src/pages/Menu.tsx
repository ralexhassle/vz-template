/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { Fragment, Suspense, useEffect } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomFamily, useUpdateAtom } from "jotai/utils";

import { client } from "@app/config";

const menuAtom = atom(async () => client.Menu.getMenu());

const categoriesAtom = atom<APP.CategoryEntity[]>([]);
const productsAtom = atom<APP.ProductEntity[]>([]);

const isRoot = (category: APP.CategoryEntity) => category.parentId === null;
const rootAtom = atom((get) => get(categoriesAtom).filter(isRoot));

const selectChildren = (id: number) => (entity: APP.EntityType) =>
  entity.parentId === id;

const entitiesAtom = atom((get) => {
  const entities = new Map<string, APP.EntityType[]>();
  const entitiesArray = [...get(productsAtom), ...get(categoriesAtom)];

  get(categoriesAtom).forEach((category) => {
    const children = entitiesArray.filter(selectChildren(category.id));
    entities.set(category.value.categoryId.toString(), children);
  });

  return entities;
});

const makeCategoryEntity = (category: API.Category): APP.CategoryEntity => ({
  type: "category",
  id: category.categoryId,
  parentId: category.parentId,
  value: category,
});

const makeProductEntity = (product: API.Product): APP.ProductEntity => ({
  type: "product",
  id: product.productId,
  parentId: product.categoryId,
  value: product,
});

const createEntitiesAtom = atom(
  (get) => get(entitiesAtom),
  (_get, set, menu: API.Menu) => {
    const { products, categories } = menu;

    set(categoriesAtom, categories.map(makeCategoryEntity));
    set(productsAtom, products.map(makeProductEntity));
  }
);

const categoriesAtomFamily = atomFamily(
  (id: number) => atom({ id, isOpen: false }),
  (a, b) => a === b
);

interface CategoryProps {
  category: API.Category;
}
function Category(props: CategoryProps) {
  const { category } = props;
  const [{ isOpen }, toggleCategory] = useAtom(
    categoriesAtomFamily(category.categoryId)
  );

  const onClick = () => {
    toggleCategory({ isOpen: !isOpen, id: category.categoryId });
  };

  return (
    <CategoryContainer>
      <button onClick={onClick} type="button">
        {category.description}
      </button>
      {isOpen && <Children parentId={category.categoryId} />}
    </CategoryContainer>
  );
}

const CategoryContainer = styled("div")`
  padding: 0.25em 0.5em;
`;

interface ChildrenProps {
  parentId: number;
}
function Children({ parentId }: ChildrenProps) {
  const [entities] = useAtom(childrenAtomFamily(parentId));

  return (
    <Fragment>
      {entities.map((entity) => {
        if (entity.type === "category") {
          return <Category key={entity.id} category={entity.value} />;
        }

        if (entity.type === "product") {
          return <Product key={entity.id} product={entity.value} />;
        }

        return null;
      })}
    </Fragment>
  );
}

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

const childrenAtomFamily = atomFamily(
  (parentId: number) =>
    atom((get) => {
      const children = get(entitiesAtom).get(parentId.toString());

      if (children && children.length > 0) {
        return children;
      }

      return [];
    }),
  (a, b) => a === b
);

function RootTree() {
  const categories = useAtomValue(rootAtom);

  return (
    <Fragment>
      {categories.map((category) => (
        <Category key={category.id} category={category.value} />
      ))}
    </Fragment>
  );
}

function Tree() {
  const [menu] = useAtom(menuAtom);
  const createEntities = useUpdateAtom(createEntitiesAtom);

  useEffect(() => {
    createEntities(menu);
  }, [menu, createEntities]);

  return <RootTree />;
}

function Menu() {
  useEffect(() => {
    client.Menu.getMenu();
  }, []);

  return (
    <Root>
      <Title>Menu</Title>
      <Suspense fallback="...loading">
        <Tree />
      </Suspense>
    </Root>
  );
}

const Title = styled("h3")``;

const Root = styled("div")``;

export default Menu;
