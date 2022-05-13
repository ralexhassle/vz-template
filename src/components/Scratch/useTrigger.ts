import { useEffect } from "react";

interface Props {
  isReady: boolean;
  trigger: VoidFunction;
}
function useTrigger({ isReady, trigger }: Props) {
  useEffect(() => {
    if (isReady) {
      trigger();
    }
  }, [isReady, trigger]);
}

export default useTrigger;
