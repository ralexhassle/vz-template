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
  id: number;
  parentId: number | null;
  value: API.Category;
}

interface ProductEntity {
  type: "product";
  id: number;
  parentId: number;
  value: API.Product;
}

type EntityType = ProductEntity | CategoryEntity;

export as namespace APP;
