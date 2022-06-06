import { FormEvent, useEffect, useReducer, useState } from "react";
import { useUpdateAtom } from "jotai/utils";
import { atom, useAtom } from "jotai";
import styled from "@emotion/styled";

import { Dialog, Spinner, Pushable, TextInput } from "@app/components";
import { client } from "@app/config";
import { STATUS } from "@app/constants";

import { createProductAtom } from "../tree";
import { toastAtom } from "../Toast/store";

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
      set(createProductAtom, product);
      set(toastAtom, {
        type: "success",
        message: `Product ${product.label} added`,
      });
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

  return (
    <EditProductContainer onSubmit={onSubmit}>
      <Spinner isLoading={status === STATUS.PENDING} onSuccess={toggleDialog}>
        <Title>Créer un produit</Title>
        <TextInputStyled value={label} onChange={(e) => set(e.target.value)} />
        <Pushable disabled={status === STATUS.PENDING}>Ajouter</Pushable>
      </Spinner>
    </EditProductContainer>
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

const EditProductContainer = styled("form")`
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
      viewBox="0 0 11 11"
      height="1em"
      width="1em"
    >
      <path d="M2.75598 0C1.23716 0 0 1.23724 0 2.75605V8.24395C0 9.76276 1.23716 11 2.75598 11H8.24393C9.76275 11 11 9.76276 11 8.24395V2.75605C11 1.23724 9.76275 0 8.24393 0H2.75598ZM2.75598 0.920869H8.24393C9.26866 0.920869 10.0792 1.73132 10.0792 2.75605V8.24395C10.0792 9.26867 9.26866 10.0791 8.24393 10.0791H2.75598C1.73125 10.0791 0.920787 9.26867 0.920787 8.24395V2.75605C0.920787 1.73132 1.73125 0.920869 2.75598 0.920869ZM5.60824 2.32452C5.48624 2.32628 5.36993 2.37641 5.28487 2.46388C5.19981 2.55135 5.15295 2.66902 5.1546 2.79102V5.00954H2.93642C2.87504 5.00804 2.81398 5.01884 2.75684 5.0413C2.6997 5.06375 2.64762 5.09742 2.60368 5.1403C2.55975 5.18318 2.52483 5.23442 2.50099 5.29099C2.47715 5.34757 2.46487 5.40835 2.46487 5.46974C2.46487 5.53114 2.47715 5.59192 2.50099 5.64849C2.52483 5.70507 2.55975 5.75631 2.60368 5.7992C2.64762 5.84208 2.6997 5.87574 2.75684 5.8982C2.81398 5.92065 2.87504 5.93145 2.93642 5.92996H5.1546V8.14811C5.15458 8.20859 5.16648 8.26848 5.18961 8.32435C5.21274 8.38023 5.24665 8.43101 5.28941 8.47378C5.33217 8.51654 5.38293 8.55047 5.4388 8.57361C5.49467 8.59676 5.55456 8.60868 5.61503 8.60868C5.67551 8.60868 5.73539 8.59676 5.79126 8.57361C5.84713 8.55047 5.8979 8.51654 5.94065 8.47378C5.98341 8.43101 6.01732 8.38023 6.04046 8.32435C6.06359 8.26848 6.07549 8.20859 6.07547 8.14811V5.92996H8.29356C8.35494 5.93145 8.41599 5.92065 8.47313 5.8982C8.53028 5.87574 8.58235 5.84208 8.62629 5.7992C8.67023 5.75631 8.70514 5.70507 8.72898 5.64849C8.75282 5.59192 8.7651 5.53114 8.7651 5.46974C8.7651 5.40835 8.75282 5.34757 8.72898 5.29099C8.70514 5.23442 8.67023 5.18318 8.62629 5.1403C8.58235 5.09742 8.53028 5.06375 8.47313 5.0413C8.41599 5.01884 8.35494 5.00804 8.29356 5.00954H6.07547V2.79102C6.0763 2.72947 6.06478 2.66837 6.04158 2.61135C6.01839 2.55433 5.98399 2.50254 5.94043 2.45905C5.89686 2.41555 5.84502 2.38123 5.78796 2.35813C5.73091 2.33502 5.66979 2.32359 5.60824 2.32452V2.32452Z" />
    </svg>
  );
}

interface Props {
  parentId: API.Category["categoryId"];
}
function CreateProduct({ parentId }: Props) {
  const [isDialogOpen, toggleDialog] = useReducer((s) => !s, false);

  return (
    <Root>
      <Button onClick={toggleDialog} type="button">
        <IconContainer>
          <AddIcon />
        </IconContainer>
        <ButtonLabel>Créer un produit</ButtonLabel>
      </Button>
      {isDialogOpen && (
        <Dialog dismiss={toggleDialog}>
          <AddProductDialog {...{ toggleDialog, categoryId: parentId }} />
        </Dialog>
      )}
    </Root>
  );
}

const Root = styled("div")`
  display: flex;
  flex-direction: column;
  align-self: flex-start;

  background: var(--wishlist-color);
  border-radius: 0.5em;
`;

const ButtonLabel = styled("span")`
  margin-left: 0.75em;
`;

const IconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  color: inherit;
`;

const Button = styled("button")`
  display: flex;
  align-items: center;
  align-self: flex-start;

  padding: 0.5em 1em;

  color: white;
  font-weight: var(--font-bold);

  background: none;
  border: none;
  cursor: pointer;

  > svg {
    color: white;
    margin-right: 0.5em;
  }
`;

export default CreateProduct;
