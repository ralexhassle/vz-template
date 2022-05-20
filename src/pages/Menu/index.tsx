/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from "@emotion/styled";
import { Suspense, useEffect } from "react";
import { useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";

import { Entities } from "./Entity";

import { createEntitiesAtom, menuAtom } from "./tree";

function RootTree() {
  return (
    <RootTreeContainer>
      <Entities parentId={null} />
    </RootTreeContainer>
  );
}

const RootTreeContainer = styled("div")`
  width: 100%;

  > *:not(:last-child) {
    margin-bottom: 0.25em;
  }
`;

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
