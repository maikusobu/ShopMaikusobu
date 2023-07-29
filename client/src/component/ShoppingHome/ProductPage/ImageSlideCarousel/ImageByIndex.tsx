const imageByIndex = (index: number, images: string[]): string =>
  images[index % images.length];

export default imageByIndex;
