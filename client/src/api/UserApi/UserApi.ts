import { baseApi } from "../BaseApi/baseApi";
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
          console.log(error);
          patchResult.undo();
        }
      },
    }),
  }),
});
export const { useGetUserByIdQuery, useUpdateUserMutation } = userApi;
