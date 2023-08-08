import { baseApi } from "../BaseApi/baseApi";
import { productApi } from "../ProductReducer/ProductApi";
import type { UserReviewProduct } from "../ProductReducer/ProductApi";
export type UserJson = {
  avatar: string;
  first_name: string;
  last_name: string;
  username: string;
  picture: string;
  idDefaultAddress: string;
  idDefaultPayment: string;
  id: string;
};
type ReactionUser = {
  product_id: string;
  user_sent_id: string;
  user_received_id: string;
  reactionValue: number;
  id_rating: string;
};
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<UserJson, string>({
      query: (id: string) => `user/${id}`,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<UserJson, Partial<UserJson>>({
      query: (user: Partial<UserJson> & Pick<UserJson, "id">) => {
        return {
          url: `user/update/${user.id}`,
          method: "PATCH",
          body: user,
        };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(
        { id, ...patch }: Partial<UserJson> & Pick<UserJson, "id">,
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUserById", id, (draft: UserJson) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    updateReaction: builder.mutation<string, ReactionUser>({
      query: (body: ReactionUser) => {
        return {
          url: "user/update-reaction",
          method: "PATCH",
          body: body,
        };
      },
      async onQueryStarted(
        { reactionValue, product_id, ...patch }: ReactionUser,
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          productApi.util.updateQueryData(
            "getReviewProduct",
            product_id,
            (draft: UserReviewProduct[]) => {
              draft.forEach((review) => {
                if (review.user_id.id !== patch.user_sent_id) {
                  review.reactionScore += reactionValue;
                }
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
  }),
});
export const {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateReactionMutation,
} = userApi;
