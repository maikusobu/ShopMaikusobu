import { baseApi } from "../BaseApi/baseApi";
export type ProductType = {
  _id: string;
  image: string[];
  amountPurchased: number;
  name?: string;
  desc?: string;
  SKU?: string;
  price: number;
  category_id: categories;
  rating_id: rating_id[];
  discount_id?: discountType;
  inventory_id?: inventory_id;
};
import { constructUrlString } from "../../Helper/constructParamString";
type discountType = {
  active: boolean;
  discount_percent: number;
};
type inventory_id = {
  quantity: number;
  _id: string;
};
type rating_id = {
  user_id: string;
  rating_value: number;
};
type categories = {
  _id: string;
  name: string[];
};
type AllProduct = {
  total: number;
  products: ProductType[];
  page: number;
};
export interface ProductParameter {
  page: number;
  sort: "relevant" | "lowestprice" | "highestprice" | "popular" | "newest";
  categories?: string[];
}
const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProduct: builder.query<AllProduct, ProductParameter>({
      query: ({ page = 1, sort = "relevant", categories }: ProductParameter) =>
        `/products?${constructUrlString({ page, sort, categories })}`,
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product" as const,
                _id,
              })),
              "Product",
            ]
          : ["Product"],
    }),
    getProductById: builder.query<ProductType, string>({
      query: (id) => `/products/${id}`,
    }),
    getTrendingProduct: builder.query<ProductType[], void>({
      query: () => `/products/trending`,
      providesTags: ["Product"],
    }),
    getSearchProduct: builder.query<ProductType[], string>({
      query: (name) => {
        return {
          url: `/products/search?name=${name}`,
        };
      },
    }),
  }),
});
export const {
  useGetAllProductQuery,
  useGetProductByIdQuery,
  useGetTrendingProductQuery,
  useGetSearchProductQuery,
} = productApi;
