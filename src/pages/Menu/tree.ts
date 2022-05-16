import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

import { client } from "@app/config";
import { isEmpty } from "@utils";
import { CategoryEntity, ProductEntity } from "@app/types";

export const menuAtom = atom(async () => client.Menu.getMenu());

export const categoriesAtom = atom<APP.CategoryEntity[]>([]);
export const productsAtom = atom<APP.ProductEntity[]>([]);

const isRoot = (category: APP.CategoryEntity) => category.parentId === null;
export const rootCategoriesAtom = atom((get) =>
  get(categoriesAtom).filter(isRoot)
);

const selectChildren = (id: number) => (entity: APP.EntityType) =>
  entity.parentId === id;

export const entitiesAtom = atom((get) => {
  const entities = new Map<number, APP.EntityType[]>();
  const entitiesArray = [...get(productsAtom), ...get(categoriesAtom)];

  get(categoriesAtom).forEach((category) => {
    const children = entitiesArray.filter(selectChildren(category.id));
    entities.set(category.value.categoryId, children);
  });

  return entities;
});

export const makeCategoryEntity = (
  category: API.Category
): APP.CategoryEntity => ({
  type: "category",
  id: category.categoryId,
  parentId: category.parentId,
  value: category,
});

export const makeProductEntity = (product: API.Product): APP.ProductEntity => ({
  type: "product",
  id: product.productId,
  parentId: product.categoryId,
  value: product,
});

export const createEntitiesAtom = atom(
  (get) => get(entitiesAtom),
  (_get, set, menu: API.Menu) => {
    const { products, categories } = menu;

    set(categoriesAtom, categories.map(makeCategoryEntity));
    set(productsAtom, products.map(makeProductEntity));
  }
);

export const categoriesAtomFamily = atomFamily(
  (category: API.Category) => atom({ category, isOpen: false }),
  (a, b) => a.categoryId === b.categoryId
);

export const childrenAtomFamily = atomFamily(
  (parentId: number) =>
    atom((get) => {
      const children = get(entitiesAtom).get(parentId);
      return children && !isEmpty(children) ? children : [];
    }),
  (a, b) => a === b
);

interface Action {
  type: "update/category/description" | "update/product/description";
  payload: { id: number; description: string };
}
export const updateEntityAtom = atom(null, (get, set, action: Action) => {
  if (action.type === "update/category/description") {
    set(categoriesAtom, (prev) =>
      prev.map((entity): CategoryEntity => {
        if (entity.id === action.payload.id) {
          const value = {
            ...entity.value,
            description: action.payload.description,
          };
          return { ...entity, value };
        }

        return entity;
      })
    );
  }

  if (action.type === "update/product/description") {
    set(productsAtom, (prev) =>
      prev.map((entity): ProductEntity => {
        if (entity.id === action.payload.id) {
          const value = {
            ...entity.value,
            description: action.payload.description,
          };

          return { ...entity, value };
        }

        return entity;
      })
    );
  }
});
