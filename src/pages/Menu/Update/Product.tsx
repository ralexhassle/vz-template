import { FormEvent, Fragment, useReducer, useState } from "react";
import { useUpdateAtom } from "jotai/utils";
import styled from "@emotion/styled";

import { Checkbox, Dialog, Pushable, TextInput } from "@app/components";
import { updateProductAtom } from "../tree";

interface UpdateProductDialogProps {
  product: API.Product;
  toggle: VoidFunction;
}
function UpdateProductDialog({ product, toggle }: UpdateProductDialogProps) {
  const [label, setLabel] = useState(product.label);
  const [description, setDescription] = useState(product.description || "");
  const [isEnabled, toggleEnabled] = useReducer((s) => !s, product.enabled);
  const update = useUpdateAtom(updateProductAtom);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    update({ ...product, label, enabled: isEnabled, description });
    toggle();
  };

  return (
    <UpdateProductDialogContainer onSubmit={onSubmit}>
      <Title>Modifier le produit</Title>
      <EnableCheckbox name="enabled" checked={isEnabled} toggle={toggleEnabled}>
        Activer le produit
      </EnableCheckbox>

      <TextInputContainer>
        <TextInputLabel>Nom du produit</TextInputLabel>
        <TextInputStyled
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </TextInputContainer>
      <TextInputContainer>
        <TextInputLabel>Description</TextInputLabel>
        <TextInputStyled
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </TextInputContainer>
      <Pushable>Modifier</Pushable>
    </UpdateProductDialogContainer>
  );
}

const EnableCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
  margin-bottom: 1em;

  [data-checkmark] {
    margin-right: 0.25em;
    border: 2px solid rgb(96, 96, 96);
    border-radius: 0.25em;
    padding: 0.25em;
  }
`;

const Title = styled("h2")`
  margin-bottom: 0.5em;
  font-weight: var(--font-bold);
  text-align: center;
`;

const TextInputContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-bottom: 1em;
`;

const TextInputLabel = styled("h3")`
  margin-bottom: 0.25em;
  font-weight: var(--font-bold);
  text-align: center;
`;

const TextInputStyled = styled(TextInput)`
  width: 100%;
  > input {
    padding: 0.5em;
  }
`;

const UpdateProductDialogContainer = styled("form")`
  display: flex;
  flex-direction: column;

  color: rgb(96, 96, 96);
`;

function UpdateIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 12 12"
      height="1em"
      width="1em"
    >
      <path d="M9.1 12H1.9C0.85 12 0 11.15 0 10.1V2.9C0 1.85 0.85 1 1.9 1H5.5C5.8 1 6 1.2 6 1.5C6 1.8 5.8 2 5.5 2H1.9C1.4 2 1 2.4 1 2.9V10.05C1 10.55 1.4 10.95 1.9 10.95H9.05C9.55 10.95 9.95 10.55 9.95 10.05V6.5C9.95 6.2 10.15 6 10.45 6C10.75 6 10.95 6.2 10.95 6.5V10.1C11 11.15 10.15 12 9.1 12V12Z" />
      <path d="M3 9.5C2.85 9.5 2.75 9.45 2.65 9.35C2.55 9.25 2.5 9.05 2.5 8.9L3 6.4C3 6.3 3.05 6.2 3.15 6.15L9.15 0.15C9.35 -0.05 9.65 -0.05 9.85 0.15L11.85 2.15C12.05 2.35 12.05 2.65 11.85 2.85L5.85 8.85C5.8 8.9 5.7 8.95 5.6 9L3.1 9.5H3V9.5ZM3.95 6.75L3.65 8.35L5.25 8.05L10.8 2.5L9.5 1.2L3.95 6.75Z" />
    </svg>
  );
}

interface Props {
  product: API.Product;
}
function UpdateProduct({ product }: Props) {
  const [isDialogOpen, toggle] = useReducer((s) => !s, false);

  return (
    <Fragment>
      <Button onClick={toggle} type="button">
        <IconContainer>
          <UpdateIcon />
        </IconContainer>
      </Button>
      {isDialogOpen && (
        <Dialog dismiss={toggle}>
          <UpdateProductDialog {...{ product, toggle }} />
        </Dialog>
      )}
    </Fragment>
  );
}

const IconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  > svg {
    color: blue;
  }
`;

const Button = styled("button")`
  display: flex;
  align-items: center;

  padding: 0.5em;

  color: white;
  font-weight: var(--font-bold);

  background: white;
  border: 0.25em solid blue;
  border-radius: 50%;

  cursor: pointer;
`;

export default UpdateProduct;
