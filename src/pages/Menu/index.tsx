/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { Suspense, useEffect } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtom } from "jotai";

import { RootCategory } from "./Entity";

import { createEntitiesAtom, menuAtom } from "./tree";

function Tree() {
  const [menu] = useAtom(menuAtom);
  const createEntities = useUpdateAtom(createEntitiesAtom);

  useEffect(() => {
    createEntities(menu);
  }, [menu, createEntities]);

  return (
    <RootTreeContainer>
      <RootCategory />
    </RootTreeContainer>
  );
}

const RootTreeContainer = styled("div")`
  width: 100%;

  > *:not(:last-child) {
    margin-bottom: 0.25em;
  }
`;

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
