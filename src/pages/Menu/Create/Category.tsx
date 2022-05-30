import { FormEvent, useEffect, useReducer, useState } from "react";
import { atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import styled from "@emotion/styled";

import { Dialog, Spinner, Pushable, TextInput } from "@app/components";
import { client } from "@app/config";
import { STATUS } from "@app/constants";

import { createCategoryAtom } from "../tree";

interface UpdateCategory {
  description: string;
  parentId: number | null;
}

const postCategoryStatusAtom = atom(STATUS.IDLE);
const postCategoryAtom = atom(
  (get) => get(postCategoryStatusAtom),
  async (_, set, { description, parentId }: UpdateCategory) => {
    try {
      set(postCategoryStatusAtom, STATUS.PENDING);

      const category = await client.Menu.postCategory({
        description,
        enabled: true,
        order: 90,
        parentId,
      });

      set(postCategoryStatusAtom, STATUS.RESOLVED);
      set(createCategoryAtom, category);
    } catch (error) {
      set(postCategoryStatusAtom, STATUS.REJECTED);
    }
  }
);

interface AddProductProps {
  toggleDialog: VoidFunction;
  parentId: API.Category["parentId"];
}
function AddCategoryDialog({ toggleDialog, parentId }: AddProductProps) {
  const [description, set] = useState("");
  const [status, setStatus] = useAtom(postCategoryStatusAtom);
  const postCategory = useUpdateAtom(postCategoryAtom);

  useEffect(
    () => () => setStatus(STATUS.IDLE),
    [status, setStatus, toggleDialog]
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postCategory({ description, parentId });
  };

  return (
    <EditCategoryContainer onSubmit={onSubmit}>
      <Spinner isLoading={status === STATUS.PENDING} onSuccess={toggleDialog}>
        <Title>Créer une catégorie</Title>
        <TextInputStyled
          value={description}
          onChange={(e) => set(e.target.value)}
        />
        <Pushable disabled={status === STATUS.PENDING}>Ajouter</Pushable>
      </Spinner>
    </EditCategoryContainer>
  );
}

const Title = styled("h2")`
  margin-bottom: 0.5em;
  font-weight: var(--font-bold);
  text-align: center;
`;

const TextInputStyled = styled(TextInput)`
  > input {
    padding: 0.5em;
  }

  margin-bottom: 1em;
`;

const EditCategoryContainer = styled("form")`
  display: flex;
  flex-direction: column;

  color: rgb(96, 96, 96);

  [data-spinner] {
    align-self: center;
  }
`;

function AddIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
    >
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" />
    </svg>
  );
}

interface Props {
  parentId: API.Category["parentId"];
}
function CreateCategory({ parentId }: Props) {
  const [isOpen, toggleDialog] = useReducer((s) => !s, false);

  return (
    <Root>
      <Button onClick={toggleDialog} type="button">
        <IconContainer>
          <AddIcon />
        </IconContainer>
        <ButtonLabel>Catégorie</ButtonLabel>
      </Button>
      {isOpen && (
        <Dialog dismiss={toggleDialog}>
          <AddCategoryDialog {...{ toggleDialog, parentId }} />
        </Dialog>
      )}
    </Root>
  );
}

const Root = styled("div")`
  display: flex;
  flex-direction: column;
  align-self: flex-start;

  // background: rgb(151, 198, 135);
  background: var(--wishlist-color);
  border-radius: 0.5em;
`;

const ButtonLabel = styled("span")`
  padding: 0.25em;
  margin-left: 0.25em;
`;

const IconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em;

  color: inherit;

  border-radius: 0.25em;
  box-shadow: 2px 2px 6px #34a1d1, -2px -2px 6px #83cff2;
  // box-shadow: 2px 2px 6px rgb(110 185 85), -2px -2px 6px rgb(189 220 179);
`;

const Button = styled("button")`
  display: flex;
  align-items: center;
  align-self: flex-start;

  padding: 0.5em;

  color: white;
  font-weight: var(--font-bold);

  border: none;
  background: none;
  cursor: pointer;

  > svg {
    color: white
    margin-right: 0.5em;
  }
`;

export default CreateCategory;
