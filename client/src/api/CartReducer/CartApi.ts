import { baseApi } from "../BaseApi/baseApi";
type CartItemType = {
  product_id?: string;
  quantity?: number;
};
type CartType = {
  _id: string;
} & CartItemType;
type CartResponse = {
  message: string;
  data: CartType;
};

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCartByProDuctId: builder.query<CartResponse, string>({
      query: (id: string) => `cart-item/${id}`,
    }),
    createCart: builder.mutation<CartResponse, CartItemType>({
      query: (data: CartItemType) => ({
        url: "/cart-item/create",
        method: "PUT",
        body: data,
      }),
    }),
    updateCart: builder.mutation<CartResponse, CartItemType>({
      query: (data: CartItemType) => ({
        url: "/cart-item/update",
        method: "PATCH",
        body: data,
      }),
    }),
    deleteCart: builder.mutation<CartResponse, CartItemType>({
      query: (data: CartItemType) => ({
        url: "/cart-item/delete",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});
export const {
  useGetCartByProDuctIdQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} = cartApi;
