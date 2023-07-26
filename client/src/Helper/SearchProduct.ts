export const searchProduct = async (name: string) => {
  if (name === "") return;
  const data = await fetch(
    `${import.meta.env.VITE_SERVER}/products/search/${name}`
  );
  console.log(data);
  return data.json();
};
