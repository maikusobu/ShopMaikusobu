import { useState, useEffect } from "react";
import { useActionData } from "react-router-dom";
export const useObjectError = () => {
  const [errorAppear, setErrorAppear] = useState(false);
  const objectError = useActionData();
  const handleSetErrorAppear = () => {
    setErrorAppear(!errorAppear);
  };
  useEffect(() => {
    if (objectError) {
      if (!errorAppear) {
        handleSetErrorAppear();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectError]);
  return { errorAppear, handleSetErrorAppear, objectError };
};
