/* eslint-disable @typescript-eslint/dot-notation */
import { Atom, atom } from "jotai";
import { atomFamily } from "jotai/utils";

import { client } from "@app/config";
import { isDefined, isEmpty } from "@utils";

export const menuAtom = atom(async () => client.Menu.getMenu());

type CategoryCollection = Record<
  API.Category["categoryId"],
  APP.CategoryEntity
>;

type ProductCollection = Record<API.Product["productId"], APP.ProductEntity>;

type SiblingCollection = Record<string, APP.EntityType[]>;

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
  (get) => get(rootCategoriesAtom),
  (_get, set, menu: API.Menu) => {
    const categoryEntries = new Map(menu.categories.map(makeCategoryEntry));
    const productEntries = new Map(menu.products.map(makeProductEntry));
    const parentEntities = new Map<string, APP.EntityType[]>();

    const categories = Object.fromEntries(categoryEntries);
    const products = Object.fromEntries(productEntries);
    const entities = [...Object.values(categories), ...Object.values(products)];

    set(categoriesAtom, categories);
    set(productsAtom, products);

    Object.values(categories).forEach((category) => {
      const children = entities.filter(selectChildren(category.id));
      parentEntities.set(String(category.value.categoryId), children);
    });

    parentEntities.set("root", Object.values(categories).filter(isRoot));

    set(siblingsAtom, Object.fromEntries(parentEntities));
  }
);

export const siblingsAtom = atom<SiblingCollection>({});
export const selectSiblings = atomFamily(
  (parentId: number | null) =>
    atom((get) => {
      const id = parentId === null ? "root" : String(parentId);
      const siblings: APP.EntityType[] = get(siblingsAtom)[id];
      return isDefined(siblings) ? siblings : [];
    }),
  (a, b) => a === b
);

export const entitiesAtomFamily = atomFamily(
  (entity: APP.EntityType) => atom(entity),
  (a, b) => a.id === b.id
);

function hasCategory(categoryId: number) {
  return (e: APP.EntityType) => e.id === categoryId;
}

function updateCategory(
  categoryId: API.Category["categoryId"],
  category: APP.CategoryEntity
) {
  return (entity: APP.EntityType) =>
    entity.id === categoryId ? category : entity;
}

export const updateCategoryAtom = atom(
  null,
  (_get, set, update: API.Category) => {
    const { categoryId, parentId } = update;
    const category: APP.CategoryEntity = makeCategoryEntity(update);
    set(categoriesAtom, (prev) => ({ ...prev, [categoryId]: category }));
    set(siblingsAtom, (prev) => {
      const id = parentId === null ? "root" : String(parentId);

      if (!isDefined(prev[id])) return { ...prev, [id]: [category] };

      if (!prev[id].some(hasCategory(categoryId))) {
        return { ...prev, [id]: [...prev[id], category] };
      }

      return {
        ...prev,
        [id]: prev[id].map(updateCategory(categoryId, category)),
      };
    });
  }
);

function hasProduct(productId: number) {
  return (e: APP.EntityType) => e.id === productId;
}

function updateProduct(
  categoryId: API.Category["categoryId"],
  product: APP.ProductEntity
) {
  return (entity: APP.EntityType) =>
    entity.id === categoryId ? product : entity;
}

export const updateProductAtom = atom(
  null,
  (_get, set, update: API.Product) => {
    const { productId, categoryId } = update;
    const product: APP.ProductEntity = makeProductEntity(update);
    set(productsAtom, (prev) => ({ ...prev, [productId]: product }));
    set(siblingsAtom, (prev) => {
      const id = String(categoryId);

      if (!isDefined(prev[id])) return { ...prev, [id]: [product] };

      if (!prev[id].some(hasProduct(productId))) {
        return { ...prev, [id]: [...prev[id], product] };
      }

      return {
        ...prev,
        [id]: prev[id].map(updateProduct(categoryId, product)),
      };
    });
  }
);

function removeSibling(id: number) {
  return (entity: APP.EntityType) => entity.id !== id;
}

export const deleteProductAtom = atom(
  null,
  (get, set, { productId, categoryId }: API.Product) => {
    const { [productId]: _, ...products } = get(productsAtom);
    set(productsAtom, products);
    set(siblingsAtom, (prev) => {
      const id = String(categoryId);
      return { ...prev, [id]: prev[id].filter(removeSibling(productId)) };
    });
  }
);

export const deleteCategoryAtom = atom(
  null,
  (get, set, { categoryId, parentId }: API.Category) => {
    const { [categoryId]: _, ...categories } = get(categoriesAtom);
    set(categoriesAtom, categories);
    set(siblingsAtom, (prev) => {
      const id = parentId === null ? "root" : String(parentId);
      return { ...prev, [id]: prev[id].filter(removeSibling(categoryId)) };
    });
  }
);

type MoveProductUpdate = {
  dragProduct: API.Product;
  hoverProduct: API.Product;
};
export const moveProductAtom = atom(
  null,
  (_get, set, update: MoveProductUpdate) => {
    const dragProduct = makeProductEntity({
      ...update.dragProduct,
      order: update.hoverProduct.order,
    });

    const hoverProduct = makeProductEntity({
      ...update.hoverProduct,
      order: update.dragProduct.order,
    });

    set(productsAtom, (prev) => ({
      ...prev,
      [dragProduct.id]: dragProduct,
      [hoverProduct.id]: hoverProduct,
    }));

    set(siblingsAtom, (prev) => {
      const categoryId = String(dragProduct.parentId);
      const entities = prev[categoryId].map((entity: APP.EntityType) => {
        if (entity.type === "category") return entity;
        if (entity.id === dragProduct.id) return dragProduct;
        if (entity.id === hoverProduct.id) return hoverProduct;
        return entity;
      });

      return { ...prev, [categoryId]: [...entities] };
    });
  }
);

type MoveCategoryUpdate = {
  dragCategory: API.Category;
  hoverCategory: API.Category;
};
export const moveCategoryAtom = atom(
  null,
  (_get, set, update: MoveCategoryUpdate) => {
    const dragCategory = makeCategoryEntity({
      ...update.dragCategory,
      order: update.hoverCategory.order,
    });

    const hoverCategory = makeCategoryEntity({
      ...update.hoverCategory,
      order: update.dragCategory.order,
    });

    set(categoriesAtom, (prev) => ({
      ...prev,
      [dragCategory.id]: dragCategory,
      [hoverCategory.id]: hoverCategory,
    }));

    set(siblingsAtom, (prev) => {
      const categoryId =
        dragCategory.parentId === null ? "root" : String(dragCategory.parentId);
      const entities = prev[categoryId].map((entity: APP.EntityType) => {
        if (entity.type === "product") return entity;
        if (entity.id === dragCategory.id) return dragCategory;
        if (entity.id === hoverCategory.id) return hoverCategory;
        return entity;
      });

      return { ...prev, [categoryId]: [...entities] };
    });
  }
);
