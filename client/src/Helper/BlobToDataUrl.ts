export const blobToDataURL = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) =>
      resolve(e.target?.result as string);
    reader.onerror = (e: ProgressEvent<FileReader>) => reject(e);
    reader.readAsDataURL(blob);
  });
