/* eslint-disable @typescript-eslint/no-use-before-define */
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { Fragment, useCallback, useRef } from "react";
import { useAtomValue, useAtom } from "jotai";
import styled from "@emotion/styled";

import type { Identifier, XYCoord } from "dnd-core";

import Update from "../Update";
import Delete from "../Delete";
import Create from "../Create";
import Select from "../Select";
import Like from "../Like";

import ToggleIndicator from "./ToggleIndicator";

import {
  categoriesAtomFamily,
  toggleAtomFamily,
  levelAtomFamily,
  selectCategoryAtomFamily,
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
      {isOpen && children}
    </CategoryContainer>
  );
}

interface EditableCategoryProps {
  id: API.Category["categoryId"];
  order: number;
  move: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}
/**
 * A "editable "Category is a node which has children in the tree.
 * It can be open or close. If it's open, we render its children.
 * It can be selected, moved, updated or deleted.
 */
function EditableCategory(props: EditableCategoryProps) {
  const { id, order, move, children } = props;
  const ref = useRef<HTMLDivElement>(null);

  const category = useAtomValue(categoriesAtomFamily(id));
  const { parentId } = category;
  const level = useAtomValue(levelAtomFamily(category.categoryId));

  const [{ isOpen }, toggle] = useAtom(toggleAtomFamily(id));

  const [{ isSelected }] = useAtom(
    selectCategoryAtomFamily(category.categoryId)
  );

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
    canDrag: isSelected && !isOpen,
    item: () => ({ id, order, type: "category" }),
    collect: (monitor: DragSourceMonitor<APP.DragItem>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const toggleOpen = useCallback(() => {
    toggle((prev) => ({ ...prev, isOpen: !isOpen }));
  }, [isOpen, toggle]);

  drag(drop(ref));

  return (
    <Fragment>
      {isSelected && (
        <EditContainer>
          <Create.Category {...{ parentId }} />
          <Update.Category {...{ category }} />
          <Delete.Category {...{ category }} />
        </EditContainer>
      )}
      <CategoryContainer
        ref={ref}
        data-handler-id={handlerId}
        data-is-dragging={isDragging}
        data-category-level={level}
        data-category
      >
        <CategorHeader>
          <Select.Category {...{ category, isSelected }} />
          <ToggleButton onClick={toggleOpen} type="button">
            <Description>
              <span>{category.description}</span>
              {!category.enabled && <Unavalaible>Indisponible</Unavalaible>}
            </Description>
            <ToggleIndicator isOpen={isOpen} />
          </ToggleButton>
        </CategorHeader>
        {isOpen && children}
      </CategoryContainer>
    </Fragment>
  );
}

const Unavalaible = styled("span")`
  padding: 0.25em 1.5em;
  margin: 0 0.5em;

  vertical-align: middle;

  background: #b1b1b1;
  border-radius: 0.5em;
  color: white;
`;

const EditContainer = styled("div")`
  display: flex;

  > div:not(:last-child) {
    margin-right: 0.5em;
  }
`;

const ToggleButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  padding: 0.75em;

  color: inherit;

  background: none;
  border: none;
  cursor: pointer;
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

  &[data-is-dragging="true"] {
    opacity: 0.5;
  }
`;

export default {
  View: Category,
  Edit: EditableCategory,
};
