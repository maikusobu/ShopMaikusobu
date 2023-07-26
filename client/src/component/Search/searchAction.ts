import { searchProduct } from "../../Helper/SearchProduct";
export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);

  const q = url.searchParams.get("q") !== null ? url.searchParams.get("q") : "";
  const products = await searchProduct(q as string);
  return { products, q };
};
