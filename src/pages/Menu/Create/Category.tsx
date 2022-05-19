import {
  FormEvent,
  Fragment,
  useDeferredValue,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";
import { atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import styled from "@emotion/styled";

import { Dialog, Spinner } from "@app/components";
import { client } from "@app/config";
import { STATUS } from "@app/constants";

import { updateCategoryAtom } from "../tree";

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
        order: 8,
        parentId,
      });

      set(postCategoryStatusAtom, STATUS.RESOLVED);
      set(updateCategoryAtom, category);
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
  const deferredStatus = useDeferredValue(status);

  useEffect(() => {
    if (deferredStatus === STATUS.RESOLVED) {
      toggleDialog();
    }
    return () => setStatus(STATUS.IDLE);
  }, [deferredStatus, setStatus, toggleDialog]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postCategory({ description, parentId });
  };

  return (
    <EditProductContainer onSubmit={onSubmit}>
      <Spinner isLoading={deferredStatus === STATUS.PENDING}>
        <TextInput value={description} onChange={(e) => set(e.target.value)} />
        <SaveButton disabled={deferredStatus === STATUS.PENDING}>
          SAVE
        </SaveButton>
      </Spinner>
    </EditProductContainer>
  );
}

const TextInput = styled("input")`
  width: 100%;
  padding: 0.5em;
  margin-bottom: 1em;
`;

const EditProductContainer = styled("form")`
  display: flex;
  flex-direction: column;
`;

const SaveButton = styled("button")`
  text-transform: uppercase;

  padding: 0.5em 1em;
  width: 100%;

  border: none;
  border-radius: 4px;
  cursor: pointer;
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
    <Fragment>
      <Button onClick={toggleDialog} type="button">
        <AddIcon />
        <span>Category</span>
      </Button>
      {isOpen && (
        <Dialog dismiss={toggleDialog}>
          <AddCategoryDialog {...{ toggleDialog, parentId }} />
        </Dialog>
      )}
    </Fragment>
  );
}

const Button = styled("button")`
  display: flex;
  align-items: center;
  align-self: flex-start;

  padding: 0.25em 0.5em;

  border: none;
  border-radius: 4px;
  cursor: pointer;

  > svg {
    color: green;
    margin-right: 0.5em;
  }
`;

export default CreateCategory;
