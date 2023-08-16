import { useState, useEffect } from "react";
import { useActionData } from "react-router-dom";
export const useObjectActionReturn = () => {
  const [isActionReturned, setisActionReturned] = useState(false);
  const objectAction = useActionData();
  const handleSetisActionReturned = () => {
    setisActionReturned(!isActionReturned);
  };
  useEffect(() => {
    if (objectAction) {
      if (!isActionReturned) {
        handleSetisActionReturned();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectAction]);
  return { isActionReturned, handleSetisActionReturned, objectAction };
};
