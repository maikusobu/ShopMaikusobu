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
import { constructUrlString } from "../../Helper/constructParamString";
type discountType = {
  active: boolean;
  discount_percent: number;
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
      providesTags: ["Product"],
    }),
    getProductById: builder.query<ProductType, string>({
      query: (id) => `/products/${id}`,
    }),
    getTrendingProduct: builder.query<ProductType[], void>({
      query: () => `/products/trending`,
      providesTags: ["Product"],
    }),
    getSearchProduct: builder.query<ProductType[], string>({
      query: (name) => `/products/search/${name}`,
    }),
  }),
});
export const {
  useGetAllProductQuery,
  useGetProductByIdQuery,
  useGetTrendingProductQuery,
  useGetSearchProductQuery,
} = productApi;
