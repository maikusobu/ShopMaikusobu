import { baseApi } from "../BaseApi/baseApi";
export type ProductType = {
  _id: string;
  image: string[];
  amountPurchased: number;
  name?: string;
  desc?: string;
  SKU?: string;
  price: number;
  category_id: string;
  discount_id?: discountType;
  inventory_id?: string;
};
type discountType = {
  active: boolean;
  discount_percent: number;
};
const productApi = baseApi.injectEndpoints({
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
