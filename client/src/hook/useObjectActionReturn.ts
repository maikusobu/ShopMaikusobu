import { useState, useEffect, useMemo } from "react";
import { useActionData } from "react-router-dom";

export const useObjectActionReturn = () => {
  const [isActionReturned, setisActionReturned] = useState(false);
  const objectAction = useActionData();
  const memoizedObjectAction = useMemo(() => objectAction, [objectAction]);

  const handleSetisActionReturned = () => {
    setisActionReturned(!isActionReturned);
  };

  useEffect(() => {
    if (memoizedObjectAction) {
      if (!isActionReturned) {
        handleSetisActionReturned();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedObjectAction]);

  return {
    isActionReturned,
    handleSetisActionReturned,
    objectAction: memoizedObjectAction,
  };
};
