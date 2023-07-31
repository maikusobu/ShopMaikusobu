export const isValidDataUrl = (dataUrl: string) => {
  try {
    const url = new URL(dataUrl);
    return url.protocol === "data:";
  } catch {
    return false;
  }
};
