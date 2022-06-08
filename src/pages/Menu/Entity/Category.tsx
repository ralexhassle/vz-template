/* eslint-disable @typescript-eslint/no-use-before-define */
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { useCallback, useEffect, useRef } from "react";
import { useAtomValue, useAtom } from "jotai";
import styled from "@emotion/styled";

import type { Identifier, XYCoord } from "dnd-core";

import Select from "../Select";
import Like from "../Like";
import ToggleIndicator from "./ToggleIndicator";
import DragIndicator from "./DragIndicator";

import {
  categoriesAtomFamily,
  toggleAtomFamily,
  levelAtomFamily,
  isCategorySelectedAtomFamily,
  isLoadingAtomFamily,
  isLastSelectedAtomFamily,
  isNewCategoryAtom,
} from "../tree";

interface CategoryProps {
  id: API.Category["categoryId"];
  children: React.ReactNode;
}
/**
 * A Category is a node which has children in the tree.
 * It can be open or close. If it's open, we render its children.
 */
function Category({ id, children }: CategoryProps) {
  const category = useAtomValue(categoriesAtomFamily(id));
  const level = useAtomValue(levelAtomFamily(category.categoryId));
  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(id));

  const onClick = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  return (
    <CategoryContainer data-category-level={level} data-category>
      <CategorHeader>
        <ToggleButton onClick={onClick} type="button">
          <Like.Category {...{ category }} />
          <Description>{category.description}</Description>
          <ToggleIndicator isOpen={isOpen} />
        </ToggleButton>
      </CategorHeader>
      {isOpen && <Children>{children}</Children>}
    </CategoryContainer>
  );
}

interface EditableCategoryProps {
  id: API.Category["categoryId"];
  order: number;
  onDragEnd: (type: "product" | "category") => void;
  move: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}
/**
 * A "editable "Category is a node which has children in the tree.
 * It can be open or close. If it's open, we render its children.
 * It can be selected, moved, updated or deleted.
 */
function EditableCategory(props: EditableCategoryProps) {
  const { id, order, move, children, onDragEnd } = props;
  const ref = useRef<HTMLDivElement>(null);
  const refButton = useRef<HTMLButtonElement>(null);

  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(id));
  const category = useAtomValue(categoriesAtomFamily(id));
  const isNew = useAtomValue(isNewCategoryAtom(category.categoryId));
  const level = useAtomValue(levelAtomFamily(category.categoryId));
  const { isLoading } = useAtomValue(isLoadingAtomFamily(category.parentId));
  const isLastSelected = useAtomValue(isLastSelectedAtomFamily(id));
  const isSelected = useAtomValue(
    isCategorySelectedAtomFamily(category.categoryId)
  );

  useEffect(() => {
    if (isNew) refButton.current?.focus();
  }, [isNew]);

  const [{ handlerId }, drop] = useDrop<
    APP.DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: String(category.parentId),
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover: (item: APP.DragItem, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.order;
      const hoverIndex = order;

      if (dragIndex === hoverIndex) return;
      const hoverRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      move(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      item.order = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: String(category.parentId),
    canDrag: isSelected && !isOpen && !isLoading,
    item: () => ({ id, order, type: "category" }),
    end: () => onDragEnd("category"),
    collect: (monitor: DragSourceMonitor<APP.DragItem>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const toggleOpen = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  drag(drop(ref));

  return (
    <CategoryRow ref={ref} data-handler-id={handlerId}>
      <CategoryContainer
        data-category
        data-is-dragging={isDragging}
        data-category-level={level}
        data-category-selected={isSelected}
      >
        <CategorHeader>
          {!isOpen && (
            <Select.Category {...{ category, isSelected, isLoading }} />
          )}
          <ToggleButton onClick={toggleOpen} type="button" ref={refButton}>
            <Description>
              <span>{category.description}</span>
              {!category.enabled && <Unavalaible>Indisponible</Unavalaible>}
            </Description>
            <ToggleIndicator isOpen={isOpen} />
          </ToggleButton>
        </CategorHeader>
        {isOpen && <Children>{children}</Children>}
      </CategoryContainer>
      {!isOpen && isLastSelected && <DragIndicator {...{ isSelected }} />}
    </CategoryRow>
  );
}

const CategoryRow = styled("div")`
  display: flex;
  align-items: center;
`;

const Children = styled("div")`
  display: flex;
  flex-direction: column;

  padding-top: 0;
  padding-right: 0.5em;
  padding-left: 0.5em;
  padding-bottom: 0.5em;

  > *:not(:last-child) {
    margin-bottom: 0.5em;
  }
`;

const Unavalaible = styled("span")`
  padding: 0.25em 1.5em;
  margin: 0 0.5em;

  vertical-align: middle;
  color: white;
  font-size: smaller;

  background: #b1b1b1;
  border-radius: 0.5em;
`;

const ToggleButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  padding: 1em;

  color: inherit;

  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const Description = styled("span")`
  flex: 1;

  font-weight: var(--font-bold);
  text-align: start;
`;

const CategorHeader = styled("div")`
  display: flex;

  color: inherit;
`;

const CategoryContainer = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 1;

  transition: background-color 1000ms ease-out;

  &[data-category-selected="true"][data-is-dragging="true"] {
    background-color: rgb(211, 230, 239);
  }
`;

export default {
  View: Category,
  Edit: EditableCategory,
};
