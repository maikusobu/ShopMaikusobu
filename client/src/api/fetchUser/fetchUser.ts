import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
type UserJson = {
  avatar: string;
};
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}` }),
  endpoints: (builder) => ({
    getUserById: builder.query<UserJson, string>({
      query: (id: string) => `user/${id}`,
    }),
  }),
});
export const { useGetUserByIdQuery } = userApi;
