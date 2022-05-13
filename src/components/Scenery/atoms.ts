import { atom } from "jotai";

export const countAtom = atom(0);
export const indexAtom = atom(0);
export const sceneStyleAtom = atom((get) => {
  const index = get(indexAtom);
  return { transform: `translateX(-${index * 100}%)` };
});

export const nextAtom = atom(null, (get, set) => {
  const index = get(indexAtom);
  set(requestAtom, index + 1);
});

export const previousAtom = atom(null, (get, set) => {
  const index = get(indexAtom);
  set(requestAtom, index - 1);
});

export const requestAtom = atom(
  (get) => get(indexAtom),
  (get, set, index: number) => {
    const count = get(countAtom);
    if (index >= 0 && index < count) {
      set(indexAtom, index);
    }
  }
);
