import { useEffect, useState, useRef, useCallback } from "react";
export const useHoverRef = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const handleHover = useCallback((hover: boolean, e: MouseEvent) => {
    if (hover === false) {
      setTimeout(() => {
        console.log(e);
        // if (isHovered === true) return;
        // console.log("ds");
        // setIsHovered(hover);
      }, 300);
    } else {
      setIsHovered(hover);
    }
  }, []);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    const node = ref.current;
    console.log(node);
    if (node) {
      node.addEventListener("mouseenter", (e: MouseEvent) =>
        handleHover(true, e)
      );
      node.addEventListener("mouseleave", (e: MouseEvent) =>
        handleHover(false, e)
      );
    }
    return () => {
      node?.removeEventListener("mouseenter", (e: MouseEvent) =>
        handleHover(true, e)
      );
      node?.removeEventListener("mouseleave", (e: MouseEvent) =>
        handleHover(false, e)
      );
    };
  }, [handleHover, ref]);
  return { isHovered, ref, handleMouseEnter, handleMouseLeave };
};
