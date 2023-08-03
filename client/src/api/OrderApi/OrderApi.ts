import { baseApi } from "../BaseApi/baseApi";
export interface OrderItem {
  _id: string;
  product_id: string;
  quantity: number;
}
interface OrderDetail {
  _id: string;
  user_id: string;
  totalPrice: number;
  totalQuantity: number;
  address_id: string;
  OrderItems: OrderItem[];
  payment_id: string;
}
const OrderAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderList: builder.query<OrderDetail[], string>({
      query: (id: string) => `/order/${id}`,
      providesTags: (result) =>
        result
          ? [
              // eslint-disable-next-line no-unsafe-optional-chaining
              ...result.map((item) => ({
                type: "Order" as const,
                id: item._id,
              })),
              "Order",
            ]
          : ["Order"],
    }),
    createOrder: builder.mutation<OrderDetail, Omit<OrderDetail, "_id">>({
      query: (data) => ({
        url: "/order/create",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation<OrderDetail, string>({
      query: (id: string) => ({
        url: `/order/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Order", id: arg }],
    }),
  }),
});
export const {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderListQuery,
} = OrderAPi;
