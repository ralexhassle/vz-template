import { useUpdateAtom } from "jotai/utils";

import { nextAtom, previousAtom } from "./atoms";

function useScene() {
  const next = useUpdateAtom(nextAtom);
  const previous = useUpdateAtom(previousAtom);

  return { next, previous };
}

export default useScene;
