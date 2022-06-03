import styled from "@emotion/styled";
import { Fragment, useCallback, useState, useEffect } from "react";

import { PORTALS } from "@app/constants";
import { animated, useSpring } from "@react-spring/web";

import { atom, useAtom, useAtomValue } from "jotai";

import { Portal } from "@app/components";

import Update from "../Update";
import Delete from "../Delete";
import Enable from "../Enable";

import {
  resetSelectedCategoriesAtom,
  resetSelectedProductsAtom,
  selectedCategoriesAtom,
  selectedProductsAtom,
} from "../tree";

const isMenuButtonOpenAtom = atom((get) => {
  const productCount = Object.values(get(selectedProductsAtom)).length;
  const categoriesCount = Object.values(get(selectedCategoriesAtom)).length;
  return productCount > 0 || categoriesCount > 0;
});

// This helper function is used in the component
const normalize = (
  subject: number,
  currentScaleMin: number,
  currentScaleMax: number,
  newScaleMin = 0,
  newScaleMax = 1
) => {
  // FIrst, normalize the value between 0 and 1.
  const standardNormalization =
    (subject - currentScaleMin) / (currentScaleMax - currentScaleMin);
  // Next, transpose that value to our desired scale.
  return (newScaleMax - newScaleMin) * standardNormalization + newScaleMin;
};

const useAngledBoop = (index: number) => {
  const [isBooped, setIsBooped] = useState(false);

  useEffect(() => {
    if (!isBooped) {
      setIsBooped(true);
    }
  }, [isBooped]);

  const angle = index * (90 / 2) + 90;
  const angleInRads = (angle * Math.PI) / 180;
  const distance = 100;
  const x = distance * Math.cos(angleInRads);
  const y = -distance * Math.sin(angleInRads);
  const friction = normalize(index, 0, 4, 15, 40);

  const { transform } = useSpring({
    transform: isBooped
      ? `translate(${x}px, ${y}px)
         rotate(${0}deg)
         scale(${1})`
      : `translate(0px, 0px)
         rotate(0deg)
         scale(1)`,
    config: {
      tension: 300,
      friction,
    },
  });

  return transform;
};

function Icon() {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.4,10.9h2.7v2.7c0,0.5,0.4,0.9,0.9,0.9s0.9-0.4,0.9-0.9v-2.7h2.7c0.5,0,0.9-0.4,0.9-0.9s-0.4-0.9-0.9-0.9 h-2.7V6.4c0-0.5-0.4-0.9-0.9-0.9S9.1,5.9,9.1,6.4v2.7H6.4c-0.5,0-0.9,0.4-0.9,0.9S5.9,10.9,6.4,10.9z" />
    </svg>
  );
}

interface ActionProps {
  index: number;
  children: React.ReactNode;
}
function Action({ index, children }: ActionProps) {
  const transform = useAngledBoop(index);
  return <ActionContainer style={{ transform }}>{children}</ActionContainer>;
}

const ActionContainer = styled(animated.div)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
`;

const ROTATE = {
  FROM: "rotate(0)",
  TO: "rotate(45deg)",
};

function ActionButton() {
  const [products, resetProducts] = useAtom(resetSelectedProductsAtom);
  const [categories, resetCategories] = useAtom(resetSelectedCategoriesAtom);
  const isOpen = useAtomValue(isMenuButtonOpenAtom);
  const rotate = isOpen ? ROTATE.TO : ROTATE.FROM;

  const onClick = useCallback(() => {
    resetProducts();
    resetCategories();
  }, [resetProducts, resetCategories]);

  const renderProductActions = useCallback((products: API.Product[]) => {
    if (products.length === 0) return null;

    if (products.length === 1) {
      const [product] = products;

      return (
        <Fragment>
          <Action index={0}>
            <Update.Product {...{ product }} />
          </Action>
          <Action index={1}>
            <Delete.Product {...{ product }} />
          </Action>
          <Action index={2}>
            <Enable.Product {...{ products }} />
          </Action>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Action index={0}>
          <Delete.Products {...{ products }} />
        </Action>
        <Action index={1}>
          <Enable.Product {...{ products }} />
        </Action>
      </Fragment>
    );
  }, []);

  const renderCategoriesActions = useCallback((categories: API.Category[]) => {
    if (categories.length === 0) return null;

    if (categories.length === 1) {
      const [category] = categories;

      return (
        <Fragment>
          <Action index={0}>
            <Update.Category {...{ category }} />
          </Action>
          <Action index={1}>
            <Delete.Category {...{ category }} />
          </Action>
          <Action index={2}>
            <Enable.Category {...{ categories }} />
          </Action>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Action index={0}>
          <Delete.Categories {...{ categories }} />
        </Action>
        <Action index={1}>
          <Enable.Category {...{ categories }} />
        </Action>
      </Fragment>
    );
  }, []);

  return (
    <ActionButtonContainer>
      <Wrapper>
        <Button onClick={onClick} style={{ transform: rotate }}>
          <Icon />
        </Button>
        {isOpen && renderProductActions(Object.values(products))}
        {isOpen && renderCategoriesActions(Object.values(categories))}
      </Wrapper>
    </ActionButtonContainer>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: min-content;
`;

export const Button = styled("div")`
  height: 3em;
  width: 3em;

  color: white;
  background-color: #41b9ef;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;

  cursor: pointer;

  transition-timing-function: cubic-bezier(0.425, 0, 0, 1);
  transition-duration: 0.4s;
  transition-property: transform;
`;

const ActionButtonContainer = styled("div")`
  position: fixed;
  right: 1em;
  bottom: 1em;
  z-index: ${PORTALS.ACTION.zIndex};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

export const Actions = styled("div")`
  position: absolute;

  display: flex;
  flex-direction: column;

  transition-timing-function: cubic-bezier(0.425, 0, 0, 1);
  transition-duration: 0.4s;
  transition-property: transform, opacity;
`;

function ActionButtonPortal() {
  return (
    <Portal id={PORTALS.ACTION.id}>
      <ActionButton />
    </Portal>
  );
}

export default ActionButtonPortal;
