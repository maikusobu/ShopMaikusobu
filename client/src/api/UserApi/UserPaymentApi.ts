import { baseApi } from "../BaseApi/baseApi";
import { UserPaymentModel } from "./UserPaymentManagerApi";
type paymentResponse = {
  message: string;
  data: UserPaymentModel;
};
const PaymentUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserPayment: builder.mutation<
      paymentResponse,
      Omit<UserPaymentModel, "_id">
    >({
      query: (payment: UserPaymentModel) => ({
        url: "/payment/create",
        body: payment,
        method: "POST",
      }),
    }),
    updateUserPayment: builder.mutation<
      paymentResponse,
      Omit<UserPaymentModel, "_id">
    >({
      query: (payment: UserPaymentModel) => ({
        url: `/payment/update/${payment._id}`,
        method: "PATCH",
        body: payment,
      }),
    }),
    deleteUserPayment: builder.mutation<
      paymentResponse,
      Omit<UserPaymentModel, "_id">
    >({
      query: (payment: UserPaymentModel) => ({
        url: `/Payment/delete/${payment._id}`,
        method: "PATCH",
        body: payment,
      }),
    }),
  }),
});
export const {
  useCreateUserPaymentMutation,
  useUpdateUserPaymentMutation,
  useDeleteUserPaymentMutation,
} = PaymentUserApi;
