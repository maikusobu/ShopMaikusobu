import { baseApi } from "../BaseApi/baseApi";
export type UserPaymentModel = {
  _id: string;
  user_id: string;
  payment_type: "credit" | "debit" | "paypal" | "bank";
  card_number: number;
  expire: string;
};
type paymentmanager = {
  user_id: string;
  payment_list: UserPaymentModel[];
};
type paymentRequest = {
  user_id: string;
  payment_id: string;
};
const paymentUserManagerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserPaymentById: builder.query<paymentmanager, string>({
      query: (id: string) => `/paymentmanager/${id}`,
      providesTags: ["Payment"],
    }),
    updateInsertPayment: builder.mutation<paymentmanager, paymentRequest>({
      query: (payment: paymentRequest) => {
        return {
          url: `/paymentmanager/update-insert/${payment.user_id}`,
          method: "PATCH",
          body: payment,
        };
      },
      invalidatesTags: ["Payment"],
    }),
    updateDeletePayment: builder.mutation<paymentmanager, paymentRequest>({
      query: (payment: paymentRequest) => {
        return {
          url: `/paymentmanager/update-delete/${payment.user_id}`,
          method: "PATCH",
          body: payment,
        };
      },
      invalidatesTags: ["Payment"],
    }),
  }),
});
export const {
  useGetUserPaymentByIdQuery,
  useUpdateInsertPaymentMutation,
  useUpdateDeletePaymentMutation,
} = paymentUserManagerApi;
