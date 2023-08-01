import { baseApi } from "../BaseApi/baseApi";
import type { ProductType } from "../ProductReducer/ProductApi";
type cart_item = {
  _id: string;
  product_id: ProductType;
  quantity: number;
};
type ShoppingSessionType = {
  cart_items: cart_item[];
  user_id?: string;
};
type shoppingType = {
  id: string;
  CartItemId: string;
};
const shoppingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShoppingSession: builder.query<ShoppingSessionType, string>({
      query: (id: string) => ({
        url: `shopping/${id}`,
        credentials: "include",
      }),

      providesTags: ["Shopping"],
    }),
    updateCartItem: builder.mutation<ShoppingSessionType, shoppingType>({
      query: ({ id, CartItemId }: shoppingType) => ({
        url: `/shopping/update-cart-item/${id}`,
        method: "PATCH",
        body: { CartItemId },
      }),
      invalidatesTags: ["Shopping"],
    }),
    updateDeleteCartItem: builder.mutation<ShoppingSessionType, shoppingType>({
      query: ({ id, CartItemId }: shoppingType) => ({
        url: `/shopping/update-delete/${id}`,
        method: "PATCH",
        body: { CartItemId },
      }),
      invalidatesTags: ["Shopping"],
    }),
    updateDeleteAllCartItem: builder.mutation<ShoppingSessionType, string>({
      query: (id: string) => ({
        url: `/shopping/update-delete-all-cart-items/${id}`,
        body: {},
        method: "PATCH",
      }),
      invalidatesTags: ["Shopping"],
    }),
  }),
});
export const {
  useGetShoppingSessionQuery,
  useUpdateCartItemMutation,
  useUpdateDeleteCartItemMutation,
  useUpdateDeleteAllCartItemMutation,
} = shoppingApi;
