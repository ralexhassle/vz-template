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

interface Child {
  id: number;
  order: number;
  type: "product" | "category";
}

interface EntityType {
  type: "product" | "category";
  id: number;
  parentId: number | null;
  children: Child[];
}

export as namespace APP;
