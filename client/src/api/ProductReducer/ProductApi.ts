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
/**
 * API endpoints for product-related operations.
 */
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all products.
     * @param page - The page number to retrieve.
     * @param sort - The sorting criteria to use.
     * @param categories - The categories to filter by.
     * @returns An object containing an array of products and pagination information.
     */
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

    /**
     * Get a product by ID.
     * @param id - The ID of the product to retrieve.
     * @returns The product with the specified ID.
     */
    getProductById: builder.query<ProductType, string>({
      query: (id) => `/products/${id}`,
    }),

    /**
     * Get the trending products.
     * @returns An array of trending products.
     */
    getTrendingProduct: builder.query<ProductType[], void>({
      query: () => `/products/trending`,
      providesTags: ["Product"],
    }),

    /**
     * Search for products by name.
     * @param name - The name of the product to search for.
     * @returns An array of products matching the search criteria.
     */
    getSearchProduct: builder.query<ProductType[], string>({
      query: (name) => {
        return {
          url: `/products/search?name=${name}`,
        };
      },
    }),

    /**
     * Get the reviews for a product.
     * @param product_id - The ID of the product to retrieve reviews for.
     * @returns An array of user reviews for the specified product.
     */
    getReviewProduct: builder.query<UserReviewProduct[], string>({
      query: (product_id: string) => `/products/review/${product_id}`,
    }),

    /**
     * Get the products with the highest review ratings.
     * @returns An array of products with the highest review ratings.
     */
    getHighestReview: builder.query<UserReviewProduct[], void>({
      query: () => `/products/review/reacion-highest`,
    }),
  }),
});
export const {
  useGetAllProductQuery,
  useGetProductByIdQuery,
  useGetTrendingProductQuery,
  useGetSearchProductQuery,
  useGetReviewProductQuery,
  useGetHighestReviewQuery,
} = productApi;
