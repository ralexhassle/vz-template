import { atom } from "jotai";

export enum ActionType {
  ADD_TOAST,
  UPDATE_TOAST,
  UPSERT_TOAST,
  DISMISS_TOAST,
  REMOVE_TOAST,
  START_PAUSE,
  END_PAUSE,
}

type Collection<T> = { [key: string]: T };

export interface Toast {
  key: string;
  message: string;
  type: "error" | "success" | "loading";
}

export const toaster = atom<Collection<Toast>>({});

export const toastAtom = atom(null, (_get, set, toast: Toast) => {
  set(toaster, (prev) => ({ ...prev, [toast.key]: toast }));
});
