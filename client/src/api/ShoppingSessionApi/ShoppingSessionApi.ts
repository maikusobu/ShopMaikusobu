import { baseApi } from "../BaseApi/baseApi";
import type { ProductType } from "../ProductReducer/ProductApi";
type cart_item = {
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
export const shoppingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShoppingSession: builder.query<ShoppingSessionType, string>({
      query: (id: string) => `shopping/${id}`,
      providesTags: ["Shopping"],
    }),

    updateCartItem: builder.mutation<ShoppingSessionType, shoppingType>({
      query: ({ id, CartItemId }: shoppingType) => ({
        url: `shopping/update-cart-item/${id}`,
        method: "PATCH",
        body: { CartItemId },
      }),
      invalidatesTags: ["Shopping"],
    }),
    updateDeleteCartItem: builder.mutation<ShoppingSessionType, shoppingType>({
      query: ({ id, CartItemId }: shoppingType) => ({
        url: `shopping/update-delete/${id}`,
        method: "PATCH",
        body: { CartItemId },
      }),
    }),
  }),
});
export const {
  useGetShoppingSessionQuery,
  useUpdateCartItemMutation,
  useUpdateDeleteCartItemMutation,
} = shoppingApi;
