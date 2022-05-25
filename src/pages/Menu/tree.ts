/* eslint-disable @typescript-eslint/dot-notation */
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

import { client } from "@app/config";
import { isDefined } from "@utils";

export const menuAtom = atom(async () => client.Menu.getMenu());

type Collection<T> = { [key: number]: T };

export const isEditableAtom = atom(false);
export const categoriesAtom = atom<Collection<API.Category>>({});
export const productsAtom = atom<Collection<API.Product>>({});
export const entitiesAtom = atom<Collection<APP.EntityType>>({});

/**
 * Here is our chance to do expensive work and prepare the tree data structure.
 * We create an entity wrapper around each product and category.
 * We want a discriminator type attribute when we want to render an entity.
 * We also want to be able to sort the entities by their order attribute.
 * Root entities are always categories.
 */
export const createEntitiesAtom = atom(null, (_get, set, menu: API.Menu) => {
  const { products, categories } = menu;

  const productMap = new Map(products.map((p) => [p.productId, p]));
  const categoryMap = new Map(categories.map((c) => [c.categoryId, c]));
  const entities = new Map<number, APP.EntityType>();

  const categoryArray = menu.categories.map((category) => ({
    id: category.categoryId,
    parentId: category.parentId,
    type: "category" as const,
    value: category,
  }));

  const productArray = menu.products.map((product) => ({
    id: product.productId,
    parentId: product.categoryId,
    type: "product" as const,
    value: product,
  }));

  const entitiyArray = [...categoryArray, ...productArray];

  entities.set(Infinity, {
    type: "category",
    id: Infinity,
    parentId: Infinity,
    children: categoryArray
      .filter((item) => item.parentId === null)
      .map((item) => ({
        id: item.id,
        type: item.type,
        order: item.value.order,
      })),
  });

  categoryArray.forEach((category) => {
    const children = entitiyArray
      .filter((item) => item.parentId === category.id)
      .map((item) => ({
        id: item.id,
        type: item.type,
        order: item.value.order,
      }));

    entities.set(category.id, {
      type: "category",
      id: category.id,
      parentId: category.parentId,
      children,
    });
  });

  set(entitiesAtom, Object.fromEntries(entities));
  set(categoriesAtom, Object.fromEntries(categoryMap));
  set(productsAtom, Object.fromEntries(productMap));
});

export const selectCategoryAtomFamily = atomFamily(
  (categoryId: API.Category["parentId"]) => atom({ categoryId, count: 0 }),
  (a, b) => a === b
);

export const selectProductAtomFamily = atomFamily(
  (productId: API.Product["productId"]) =>
    atom({ isSelected: false, productId }),
  (a, b) => a === b
);

export const toggleAtomFamily = atomFamily(
  (categoryId: API.Category["categoryId"]) =>
    atom({ isOpen: false, categoryId }),
  (a, b) => a === b
);

export const categoriesAtomFamily = atomFamily(
  (categoryId: API.Category["categoryId"]) =>
    atom((get) => get(categoriesAtom)[categoryId]),
  (a, b) => a === b
);

const selectAncestors = (
  categories: Collection<API.Category>,
  id: number | null
): API.Category[] => {
  if (id === null) return [];
  const category = categories[id];
  if (!isDefined(category)) return [];
  return [category, ...selectAncestors(categories, category.parentId)];
};
export const levelAtomFamily = atomFamily(
  (id: API.Category["parentId"]) =>
    atom((get) => selectAncestors(get(categoriesAtom), id).length),
  (a, b) => a === b
);

export const productsAtomFamily = atomFamily(
  (productId: API.Product["productId"]) =>
    atom((get) => get(productsAtom)[productId]),
  (a, b) => a === b
);

const ascendingOrder = (a: APP.Child, b: APP.Child) => a.order - b.order;
export const childrenAtomFamily = atomFamily((children: APP.Child[]) =>
  atom(children.sort(ascendingOrder))
);

export const selectChildrenAtomFamily = atomFamily(
  (id: number) =>
    atom((get) => {
      const entities = get(entitiesAtom)[id];
      if (!isDefined(entities)) return [];
      return entities.children;
    }),
  (a, b) => a === b
);

export const createCategoryAtom = atom(
  null,
  (get, set, create: API.Category) => {
    const { categoryId } = create;
    set(categoriesAtom, (prev) => ({ ...prev, [categoryId]: create }));

    set(entitiesAtom, (prev) => {
      const parentId = create.parentId === null ? Infinity : create.parentId;
      const parent = get(entitiesAtom)[parentId];

      const category: APP.EntityType = {
        id: categoryId,
        type: "category",
        parentId,
        children: [],
      };

      const child: APP.Child = {
        id: categoryId,
        type: "category",
        order: create.order,
      };

      return {
        ...prev,
        [category.id]: category,
        [parentId]: { ...parent, children: [...parent.children, child] },
      };
    });
  }
);

export const createProductAtom = atom(null, (get, set, create: API.Product) => {
  const { productId, categoryId: parentId } = create;
  set(productsAtom, (prev) => ({ ...prev, [productId]: create }));

  set(entitiesAtom, (prev) => {
    const parent = get(entitiesAtom)[create.categoryId];

    const child: APP.Child = {
      id: productId,
      type: "product",
      order: create.order,
    };

    return {
      ...prev,
      [parentId]: { ...parent, children: [...parent.children, child] },
    };
  });
});

export const updateCategoryAtom = atom(
  null,
  (_get, set, category: API.Category) => {
    const { categoryId } = category;
    set(categoriesAtom, (prev) => ({ ...prev, [categoryId]: category }));
  }
);

export const updateProductAtom = atom(
  null,
  (_get, set, product: API.Product) => {
    const { productId } = product;
    set(productsAtom, (prev) => ({ ...prev, [productId]: product }));
  }
);

export const deleteProductAtom = atom(
  null,
  (get, set, { productId, categoryId }: API.Product) => {
    const { [productId]: _, ...products } = get(productsAtom);
    set(entitiesAtom, (prev) => {
      const parent = get(entitiesAtom)[categoryId];
      const children = parent.children.filter(removeChild(productId));
      return { ...prev, [categoryId]: { ...parent, children } };
    });
    set(productsAtom, products);
  }
);

const removeChild = (id: number) => (child: APP.Child) => child.id !== id;
export const deleteCategoryAtom = atom(
  null,
  (get, set, { parentId, categoryId }: API.Category) => {
    const { [categoryId]: _, ...categories } = get(categoriesAtom);
    set(entitiesAtom, (prev) => {
      const id = parentId === null ? Infinity : parentId;
      const parent = get(entitiesAtom)[id];
      const children = parent.children.filter(removeChild(categoryId));
      const { [categoryId]: _, ...entities } = prev;
      return { ...entities, [id]: { ...parent, children } };
    });
    set(categoriesAtom, categories);
  }
);

export const toggleSelectProductAtom = atom(
  null,
  (get, set, product: API.Product) => {
    const subject = get(selectProductAtomFamily(product.productId));

    set(selectProductAtomFamily(product.productId), {
      ...subject,
      isSelected: !subject.isSelected,
    });

    const ancestors = selectAncestors(get(categoriesAtom), product.categoryId);

    ancestors.forEach((ancestor: API.Category) => {
      set(selectCategoryAtomFamily(ancestor.categoryId), (prev) => {
        if (subject.isSelected) return { ...prev, count: prev.count - 1 };
        return { ...prev, count: prev.count + 1 };
      });
    });
  }
);
