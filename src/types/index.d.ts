import { STATUS, ERRORS, PORTAL_ID } from "@constants";

import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ChangeEvent,
  ButtonHTMLAttributes,
} from "react";

type Status = `${STATUS}`;
type KnownError = `${ERRORS}`;
type PortalId = `${PORTAL_ID}`;

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type InputEvent = ChangeEvent<HTMLInputElement>;

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface CategoryEntity {
  type: "category";
  id: API.Category["categoryId"];
  parentId: API.Category["parentId"];
  value: API.Category;
}

interface ProductEntity {
  type: "product";
  id: API.Product["productId"];
  parentId: API.Product["categoryId"];
  value: API.Product;
}

type EntityType = ProductEntity | CategoryEntity;

export as namespace APP;
