import { baseApi } from "../BaseApi/baseApi";
import type { UserJson } from "../UserApi/UserApi";
export type ProductType = {
  _id: string;
  image: string[];
  amountPurchased: number;
  name?: string;
  desc?: string;
  SKU?: string;
  price: number;
  category_id: categories;
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
type categories = {
  _id: string;
  name: string[];
};
type AllProduct = {
  total: number;
  products: ProductType[];
  page: number;
};
type userRating = {
  _id: string;
  rating_value: number;
  review: string;
};
type reactionScoreType = {
  _id: string;
  upvote: string[];
  downvote: string[];
};
export type UserReviewProduct = {
  _id: string;
  user_id: UserJson;
  product_id: string;
  user_rating: userRating;
  reactionScore: reactionScoreType;
};
export interface ProductParameter {
  page: number;
  sort: "relevant" | "lowestprice" | "highestprice" | "popular" | "newest";
  categories?: string[];
}
export const productApi = baseApi.injectEndpoints({
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
    getReviewProduct: builder.query<UserReviewProduct[], string>({
      query: (product_id: string) => `/products/review/${product_id}`,
    }),
  }),
});
export const {
  useGetAllProductQuery,
  useGetProductByIdQuery,
  useGetTrendingProductQuery,
  useGetSearchProductQuery,
  useGetReviewProductQuery,
} = productApi;
