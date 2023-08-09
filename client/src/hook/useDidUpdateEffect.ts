/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDidUpdateEffect(fn: (arg?: any) => void, inputs: any[]) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, inputs);
}
export default useDidUpdateEffect;
