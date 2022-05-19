/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { Fragment, Suspense, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";

import Category from "./Category";
import Create from "./Create";

import { createEntitiesAtom, rootCategoriesAtom, menuAtom } from "./tree";

function RootTree() {
  const categories = useAtomValue(rootCategoriesAtom);

  return (
    <Fragment>
      <Create.Category parentId={null} />
      {categories.map(({ id }) => (
        <Category categoryId={id} key={id} />
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
