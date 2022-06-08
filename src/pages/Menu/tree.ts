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

export const selectedProductsAtom = atom<Collection<API.Product>>({});
export const selectedCategoriesAtom = atom<Collection<API.Category>>({});

export const getSelectedProductCountAtom = atom(
  (get) => Object.values(get(selectedProductsAtom)).length
);

export const resetSelectedCategoriesAtom = atom(
  (get) => get(selectedCategoriesAtom),
  (_get, set) => {
    set(selectedCategoriesAtom, {});
  }
);

export const resetSelectedProductsAtom = atom(
  (get) => get(selectedProductsAtom),
  (_get, set) => {
    set(selectedProductsAtom, {});
  }
);

/**
 * Here is our chance to do expensive work and prepare the tree data structure.
 * We create an entity wrapper around each product and category.
 * We want a discriminator type attribute when we want to render an entity.
 * We also want to be able to sort the entities by their order attribute.
 * Root entities are always categories.
 */
export const createEntitiesAtom = atom(null, (_get, set, menu: API.Menu) => {
  const { products, categories } = menu;

  // Preparing key value pairs for each entity, we want O(1) complexity
  // when looking for entity by its id.
  const productMap = new Map(products.map((p) => [p.productId, p]));
  const categoryMap = new Map(categories.map((c) => [c.categoryId, c]));

  // Key value pairs for each entity id and its direct children
  const entities = new Map<number, APP.EntityType>();

  // Keeping track of the entity type...
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

  // ... when looking in the whole entities' array
  const entitiyArray = [...categoryArray, ...productArray];

  // setting a virtual root category entity. Its parentId is set
  // to Infinity by design
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

  // For each category setting all its children in the entities map
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

  // Creating a collection for categories, products and entities
  // We want to benefit from O(1) complexity when looking for an entity
  set(entitiesAtom, Object.fromEntries(entities));
  set(categoriesAtom, Object.fromEntries(categoryMap));
  set(productsAtom, Object.fromEntries(productMap));
});

export const likeCategoryCount = atomFamily(
  (categoryId: API.Category["parentId"]) => atom({ categoryId, count: 0 }),
  (a, b) => a === b
);

export const likeProductAtomFamily = atomFamily(
  (productId: API.Product["productId"]) => atom({ isLiked: false, productId }),
  (a, b) => a === b
);

export const isCategorySelectedAtomFamily = atomFamily(
  (categoryId: API.Category["categoryId"]) =>
    atom((get) => categoryId in get(selectedCategoriesAtom)),
  (a, b) => a === b
);

export const isProductSelectedAtomFamily = atomFamily(
  (productId: API.Product["productId"]) =>
    atom((get) => productId in get(selectedProductsAtom)),
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

const getAncestors = (
  categories: Collection<API.Category>,
  id: number | null
): API.Category[] => {
  if (id === null) return [];
  const category = categories[id];
  if (!isDefined(category)) return [];
  return [category, ...getAncestors(categories, category.parentId)];
};
export const levelAtomFamily = atomFamily(
  (id: API.Category["parentId"]) =>
    atom((get) => getAncestors(get(categoriesAtom), id).length),
  (a, b) => a === b
);

export const productsAtomFamily = atomFamily(
  (productId: API.Product["productId"]) =>
    atom((get) => get(productsAtom)[productId]),
  (a, b) => a === b
);

const ascendingOrder = (a: APP.Child, b: APP.Child) => a.order - b.order;
export const childrenAtomFamily = atomFamily(
  (children: APP.Child[]) => atom(children.sort(ascendingOrder)),
  (a, b) => a === b
);

export const getChildrenAtomFamily = atomFamily(
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
    set(newlyCreatedCategoryAtom, create);
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
  set(newlyCreatedProductAtom, create);
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
    set(productsAtom, products);

    set(entitiesAtom, (prev) => {
      const parent = get(entitiesAtom)[categoryId];
      const children = parent.children.filter(removeChild(productId));
      return { ...prev, [categoryId]: { ...parent, children } };
    });

    set(selectedProductsAtom, (prev) => {
      const { [productId]: _, ...selectedProducts } = prev;
      return selectedProducts;
    });
  }
);

const removeChild = (id: number) => (child: APP.Child) => child.id !== id;
export const deleteCategoryAtom = atom(
  null,
  (get, set, { parentId, categoryId }: API.Category) => {
    const { [categoryId]: _, ...categories } = get(categoriesAtom);
    set(categoriesAtom, categories);

    set(entitiesAtom, (prev) => {
      const id = parentId === null ? Infinity : parentId;
      const parent = get(entitiesAtom)[id];
      const children = parent.children.filter(removeChild(categoryId));
      const { [categoryId]: _, ...entities } = prev;
      return { ...entities, [id]: { ...parent, children } };
    });

    set(selectedCategoriesAtom, (prev) => {
      const { [categoryId]: _, ...selectedCategories } = prev;
      return selectedCategories;
    });
  }
);

export const toggleLikeProductAtom = atom(
  null,
  (get, set, product: API.Product) => {
    const subject = get(likeProductAtomFamily(product.productId));

    set(likeProductAtomFamily(product.productId), {
      ...subject,
      isLiked: !subject.isLiked,
    });

    const ancestors = getAncestors(get(categoriesAtom), product.categoryId);

    ancestors.forEach((ancestor: API.Category) => {
      set(likeCategoryCount(ancestor.categoryId), (prev) => {
        if (subject.isLiked) return { ...prev, count: prev.count - 1 };
        return { ...prev, count: prev.count + 1 };
      });
    });
  }
);

export const isLastSelectedAtomFamily = atomFamily((id: number | null) =>
  atom((get) => get(lastSelectedAtom).at(-1) === id)
);

type NumberOrNull = number | null;
export const lastSelectedAtom = atom<NumberOrNull[]>([]);

export const toggleSelectProductAtom = atom(
  null,
  (get, set, currentProduct: API.Product) => {
    const { productId, categoryId } = currentProduct;
    const products = get(selectedProductsAtom);

    set(resetSelectedCategoriesAtom, {});

    Object.values(products).forEach((product: API.Product) => {
      // already selected remove from collection
      if (product.productId === productId) {
        set(lastSelectedAtom, (p) => p.filter((id) => id !== productId));
        set(selectedProductsAtom, (prev) => {
          const { [product.productId]: _, ...selectedProducts } = prev;
          return selectedProducts;
        });
      }

      // if in another category remove from collection
      if (product.categoryId !== categoryId) {
        set(lastSelectedAtom, (p) =>
          p.filter((id) => id !== product.productId)
        );
        set(selectedProductsAtom, (prev) => {
          const { [product.productId]: _, ...selectedProducts } = prev;
          return selectedProducts;
        });
      }
    });

    // if not selected add to the collection
    if (!isDefined(products[productId])) {
      set(lastSelectedAtom, (prev) => [...prev, productId]);
      set(selectedProductsAtom, (prev) => ({
        ...prev,
        [productId]: currentProduct,
      }));
    }
  }
);

export const toggleSelectCategoryAtom = atom(
  null,
  (get, set, currentCategory: API.Category) => {
    const { categoryId, parentId } = currentCategory;
    const categories = get(selectedCategoriesAtom);

    set(resetSelectedProductsAtom, {});

    Object.values(categories).forEach((category: API.Category) => {
      if (category.categoryId === categoryId) {
        set(lastSelectedAtom, (p) => p.filter((id) => id !== categoryId));
        set(selectedCategoriesAtom, (prev) => {
          const { [category.categoryId]: _, ...selectedProducts } = prev;
          return selectedProducts;
        });
      }

      if (category.parentId !== parentId) {
        set(lastSelectedAtom, (p) =>
          p.filter((id) => id !== category.categoryId)
        );
        set(selectedCategoriesAtom, (prev) => {
          const { [category.categoryId]: _, ...selectedProducts } = prev;
          return selectedProducts;
        });
      }
    });

    if (!isDefined(categories[categoryId])) {
      set(lastSelectedAtom, (prev) => [...prev, categoryId]);
      set(selectedCategoriesAtom, (prev) => ({
        ...prev,
        [categoryId]: currentCategory,
      }));
    }
  }
);

export const isLoadingAtomFamily = atomFamily(
  (id: number | null) => atom({ id, isLoading: false }),
  (a, b) => a === b
);

export const newlyCreatedCategoryAtom = atom<API.Category | null>(null);
export const newlyCreatedProductAtom = atom<API.Product | null>(null);

export const isNewCategoryAtom = atomFamily((id: number | null) =>
  atom((get) => get(newlyCreatedCategoryAtom)?.categoryId === id || false)
);

export const isNewProductAtom = atomFamily((id: number | null) =>
  atom((get) => get(newlyCreatedProductAtom)?.productId === id || false)
);
