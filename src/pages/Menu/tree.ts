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

type ParentCollection = Record<API.Category["categoryId"], APP.EntityType[]>;

export const categoriesAtom = atom<CategoryCollection>({});
export const productsAtom = atom<ProductCollection>({});

export const toggleAtomFamily = atomFamily(
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

export const parentEntitiesAtom = atom<ParentCollection>((get) => {
  const parentEntities = new Map<number, APP.EntityType[]>();
  const categories = get(categoriesAtom);
  const products = get(productsAtom);
  const entities = [...Object.values(categories), ...Object.values(products)];

  Object.values(categories).forEach((category) => {
    const children = entities.filter(selectChildren(category.id));
    parentEntities.set(category.value.categoryId, children);
  });

  return Object.fromEntries(parentEntities);
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
    const categoryEntries = new Map(menu.categories.map(makeCategoryEntry));
    const productEntries = new Map(menu.products.map(makeProductEntry));
    set(categoriesAtom, Object.fromEntries(categoryEntries));
    set(productsAtom, Object.fromEntries(productEntries));
  }
);

const ascendingOrder = (a: APP.EntityType, b: APP.EntityType) =>
  a.value.order - b.value.order;

export const childrenAtomFamily = atomFamily(
  (parentId: number | null) =>
    atom((get) => {
      if (parentId === null) {
        return get(rootCategoriesAtom).sort(ascendingOrder);
      }

      const children = get(parentEntitiesAtom)[parentId];

      if (!children) return [];
      if (isEmpty(children)) return [];
      return children.sort(ascendingOrder);
    }),
  (a, b) => a === b
);

export const entitiesAtomFamily = atomFamily(
  (entity: APP.EntityType) => atom(entity),
  (a, b) => a.id === b.id
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
