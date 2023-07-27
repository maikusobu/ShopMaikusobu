import { ProductParameter } from "../api/ProductReducer/ProductApi";

export const constructUrlString = (products: ProductParameter) => {
  return Object.entries(products)
    .map(([key, value]) => {
      if (key === "categories" && value.length > 0)
        return `${key}=${value.join(",")}`;
      else return `${key}=${value}`;
    })
    .join("&");
};
