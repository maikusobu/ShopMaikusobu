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

const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCartByProDuctId: builder.query<CartResponse, string>({
      query: (id: string) => `cart-item/${id}`,
      providesTags: ["Cart"],
    }),
    createCart: builder.mutation<CartResponse, CartItemType>({
      query: (data: CartItemType) => ({
        url: "/cart-item/create",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    updateCart: builder.mutation<CartResponse, CartItemType>({
      query: (data: CartItemType) => ({
        url: "/cart-item/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Shopping"],
    }),
    deleteCart: builder.mutation<CartResponse, Omit<CartItemType, "quantity">>({
      query: (data: CartItemType) => ({
        url: "/cart-item/delete",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Shopping"],
    }),
  }),
});
export const {
  useGetCartByProDuctIdQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} = cartApi;
