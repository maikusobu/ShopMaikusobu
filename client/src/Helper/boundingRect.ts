export function boundingRect(element: HTMLElement) {
  let top = 0,
    bottom = 0,
    right = 0,
    left = 0,
    width = 0,
    height = 0;
  if (element) {
    const boundingRect = element.getBoundingClientRect();
    (top = boundingRect.top),
      (bottom = boundingRect.bottom),
      (right = boundingRect.right),
      (left = boundingRect.left);
    width = boundingRect.width;
    height = boundingRect.height;
  }
  return { top, bottom, right, left, width, height };
}
