import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
export type ProductType = {
  _id: string;
  image: string[];
  amountPurchased: number;
  name?: string;
  desc?: string;
  SKU?: string;
  price?: number;
  category_id?: string;
  discount_id?: string;
  inventory_id?: string;
};
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}` }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getAllProduct: builder.query<ProductType[], void>({
      query: () => `/products/all`,
      providesTags: ["Product"],
    }),
    getProductById: builder.query<ProductType, string>({
      query: (id) => `/products/${id}`,
    }),
    getTrendingProduct: builder.query<ProductType[], void>({
      query: () => `/products/trending`,
      providesTags: ["Product"],
    }),
  }),
});
export const {
  useGetAllProductQuery,
  useGetProductByIdQuery,
  useGetTrendingProductQuery,
} = productApi;
