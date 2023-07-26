import { baseApi } from "../BaseApi/baseApi";
export interface OrderItem {
  _id: string;
  product_id: string;
  quantity: number;
}
interface OrderDetail {
  _id: string;
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
      providesTags: ["Order"],
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
      invalidatesTags: ["Order"],
    }),
  }),
});
export const {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderListQuery,
} = OrderAPi;
