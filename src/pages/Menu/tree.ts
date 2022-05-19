import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

import { client } from "@app/config";
import { isEmpty } from "@utils";

export const menuAtom = atom(async () => client.Menu.getMenu());

type CategoryCollection = Record<
  API.Category["categoryId"],
  APP.CategoryEntity
>;

type ProductCollection = Record<API.Product["productId"], APP.ProductEntity>;

export const categoriesAtom = atom<CategoryCollection>({});
export const productsAtom = atom<ProductCollection>({});

export const categoriesStatusFamily = atomFamily(
  (categoryId: number) => atom({ isOpen: false, categoryId }),
  (a, b) => a === b
);

export const categoriesAtomFamily = atomFamily(
  (categoryId: number) => atom((get) => get(categoriesAtom)[categoryId]),
  (a, b) => a === b
);

export const productsAtomFamily = atomFamily(
  (productId: number) => atom((get) => get(productsAtom)[productId]),
  (a, b) => a === b
);

const isRoot = (category: APP.CategoryEntity) => category.parentId === null;
export const rootCategoriesAtom = atom((get) =>
  Object.values(get(categoriesAtom)).filter(isRoot)
);

const selectChildren = (id: number) => (entity: APP.EntityType) =>
  entity.parentId === id;

export const parentEntitiesAtom = atom((get) => {
  const entities = new Map<number, APP.EntityType[]>();
  const entitiesArray = [
    ...Object.values(get(productsAtom)),
    ...Object.values(get(categoriesAtom)),
  ];

  Object.values(get(categoriesAtom)).forEach((category) => {
    const children = entitiesArray.filter(selectChildren(category.id));
    entities.set(category.value.categoryId, children);
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

const makeProductEntry = (
  product: API.Product
): [number, APP.ProductEntity] => [
  product.productId,
  makeProductEntity(product),
];

const makeCategoryEntry = (
  category: API.Category
): [number, APP.CategoryEntity] => [
  category.categoryId,
  makeCategoryEntity(category),
];

export const createEntitiesAtom = atom(
  (get) => get(parentEntitiesAtom),
  (_get, set, menu: API.Menu) => {
    const { products, categories } = menu;

    const categoryEntries = new Map(categories.map(makeCategoryEntry));
    const productEntries = new Map(products.map(makeProductEntry));

    set(categoriesAtom, Object.fromEntries(categoryEntries));
    set(productsAtom, Object.fromEntries(productEntries));
  }
);

export const childrenAtomFamily = atomFamily(
  (parentId: number) =>
    atom((get) => {
      const children = get(parentEntitiesAtom).get(parentId);
      return children && !isEmpty(children) ? children : [];
    }),
  (a, b) => a === b
);

export const updateCategoryAtom = atom(
  null,
  (_get, set, category: API.Category) => {
    const { categoryId: id } = category;

    set(categoriesAtom, (prev) => ({
      ...prev,
      [id]: makeCategoryEntity(category),
    }));
  }
);

export const updateProductAtom = atom(
  null,
  (_get, set, product: API.Product) => {
    const { productId: id } = product;

    set(productsAtom, (prev) => ({
      ...prev,
      [id]: makeProductEntity(product),
    }));
  }
);

export const deleteProductAtom = atom(
  null,
  (get, set, product: API.Product) => {
    const { [product.productId]: _, ...products } = get(productsAtom);
    set(productsAtom, products);
  }
);

export const deleteCategoryAtom = atom(
  null,
  (get, set, category: API.Category) => {
    const { [category.categoryId]: _, ...categories } = get(categoriesAtom);
    set(categoriesAtom, categories);
  }
);
