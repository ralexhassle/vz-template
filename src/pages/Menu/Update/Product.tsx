import { useReducer, useState } from "react";
import { useUpdateAtom } from "jotai/utils";
import styled from "@emotion/styled";

import { Checkbox, Dialog, Pushable, TextInput } from "@app/components";
import { updateProductAtom } from "../tree";

interface UpdateProductDialogProps {
  product: API.Product;
  toggle: VoidFunction;
}
function UpdateProductDialog({ product, toggle }: UpdateProductDialogProps) {
  const [label, set] = useState(product.label);
  const [isEnabled, toggleEnabled] = useReducer((s) => !s, product.enabled);
  const update = useUpdateAtom(updateProductAtom);

  const onClick = () => {
    update({ ...product, label, enabled: isEnabled });
    toggle();
  };

  return (
    <UpdateProductDialogContainer>
      <Title>Modifier le produit</Title>
      <EnableCheckbox name="enabled" checked={isEnabled} toggle={toggleEnabled}>
        Activer le produit
      </EnableCheckbox>
      <TextInputStyled value={label} onChange={(e) => set(e.target.value)} />
      <Pushable onClick={onClick}>Modifier</Pushable>
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

const TextInputStyled = styled(TextInput)`
  > input {
    padding: 0.5em;
  }

  margin-bottom: 1em;
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
      viewBox="0 0 576 512"
      height="1em"
      width="1em"
    >
      <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
    </svg>
  );
}

interface Props {
  product: API.Product;
}
function UpdateProduct({ product }: Props) {
  const [isDialogOpen, toggle] = useReducer((s) => !s, false);

  return (
    <Root>
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

const IconContainer = styled("div")`
  display: flex;
  align-self: stretch;
  align-items: center;

  padding: 0.5em;

  color: inherit;

  border-radius: 0.25em;
  box-shadow: 2px 2px 6px #34a1d1, -2px -2px 6px #83cff2;
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

export default UpdateProduct;
