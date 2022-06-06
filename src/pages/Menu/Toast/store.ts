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

export interface Toast {
  message: string;
  type: "error" | "success";
}

export interface ToastItem extends Toast {
  key: string;
}

export const toaster = atom<ToastItem[]>([]);

export const toastAtom = atom(null, (get, set, { message, type }: Toast) => {
  console.log(message);
  const key = `${new Date().valueOf()}${message}`;
  const toast = { key, message, type };
  set(toaster, (prev) => [...prev, toast]);
});
