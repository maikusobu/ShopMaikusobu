import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
type UserPaymentModel = {
  user_id: string;
  payment_type: "credit" | "debit" | "paypal" | "bank";
  card_number: number;
  expire: string;
};
export const paymentUserApi = createApi({
  reducerPath: "paymentUserApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}` }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getUserPaymentById: builder.query<UserPaymentModel, string>({
      query: (id: string) => `payment/${id}`,
      transformResponse: (response: UserPaymentModel[]) => response[0],
      providesTags: ["Payment"],
    }),
    upsertUserPayment: builder.mutation<
      UserPaymentModel,
      Partial<UserPaymentModel>
    >({
      query: (
        payment: Partial<UserPaymentModel> & Pick<UserPaymentModel, "user_id">
      ) => {
        return {
          url: `payment/${payment.user_id}`,
          method: "PUT",
          body: payment,
        };
      },
      invalidatesTags: ["Payment"],
      async onQueryStarted(
        {
          user_id,
          ...patch
        }: Partial<UserPaymentModel> & Pick<UserPaymentModel, "user_id">,
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          paymentUserApi.util.updateQueryData(
            "getUserPaymentById",
            user_id,
            (draft: UserPaymentModel) => {
              Object.assign(draft, patch);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      },
    }),
  }),
});
export const { useGetUserPaymentByIdQuery, useUpsertUserPaymentMutation } =
  paymentUserApi;
