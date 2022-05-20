import { FormEvent, Fragment, useEffect, useReducer, useState } from "react";
import { useUpdateAtom } from "jotai/utils";
import { atom, useAtom } from "jotai";
import styled from "@emotion/styled";

import { Dialog, Spinner } from "@app/components";
import { client } from "@app/config";
import { STATUS } from "@app/constants";

import { updateProductAtom } from "../tree";

interface UpdateCategory {
  label: string;
  categoryId: number;
}

const postProductStatusAtom = atom(STATUS.IDLE);
const postProductAtom = atom(
  (get) => get(postProductStatusAtom),
  async (_, set, { label, categoryId }: UpdateCategory) => {
    try {
      set(postProductStatusAtom, STATUS.PENDING);
      const product = await client.Menu.postProduct({
        categoryId,
        label,
        description: "Totenhopfen - Special Bitter",
        enabled: true,
        order: 971,
        pictogramUrl: null,
        price1: 6.8,
        price1Label: "50cl ",
        price2: null,
        price2Label: null,
        price3: null,
        price3Label: null,
        price4: null,
        price4Label: null,
        price5: null,
        price5Label: null,
      });

      set(postProductStatusAtom, STATUS.RESOLVED);
      set(updateProductAtom, product);
    } catch (error) {
      set(postProductStatusAtom, STATUS.REJECTED);
    }
  }
);

interface AddProductProps {
  toggleDialog: VoidFunction;
  categoryId: API.Category["categoryId"];
}
function AddProductDialog({ toggleDialog, categoryId }: AddProductProps) {
  const [label, set] = useState("");
  const [status, setStatus] = useAtom(postProductStatusAtom);
  const postProduct = useUpdateAtom(postProductAtom);

  useEffect(() => () => setStatus(STATUS.IDLE), [setStatus]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postProduct({ label, categoryId });
  };

  console.log(status);

  return (
    <EditProductContainer onSubmit={onSubmit}>
      <Spinner isLoading={status === STATUS.PENDING} onSuccess={toggleDialog}>
        <TextInput value={label} onChange={(e) => set(e.target.value)} />
        <SaveButton disabled={status === STATUS.PENDING}>SAVE</SaveButton>
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
  categoryId: API.Category["categoryId"];
}
function CreateProduct({ categoryId }: Props) {
  const [isDialogOpen, toggleDialog] = useReducer((s) => !s, false);

  return (
    <Fragment>
      <Button onClick={toggleDialog} type="button">
        <AddIcon />
        <span>Product</span>
      </Button>
      {isDialogOpen && (
        <Dialog dismiss={toggleDialog}>
          <AddProductDialog {...{ toggleDialog, categoryId }} />
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

export default CreateProduct;
