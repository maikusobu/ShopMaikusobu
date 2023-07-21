import { baseApi } from "../BaseApi/baseApi";
import type { addressUserType } from "./UserAddressMangaerApi";
type AddressResponse = {
  message: string;
  data: addressUserType;
};
const AddressUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserAddress: builder.mutation<
      AddressResponse,
      Omit<addressUserType, "_id">
    >({
      query: (address: addressUserType) => ({
        url: "/address/create",
        body: address,
        method: "POST",
      }),
    }),
    updateUserAddress: builder.mutation<
      AddressResponse,
      Omit<addressUserType, "_id">
    >({
      query: (address: addressUserType) => ({
        url: `/address/update/${address._id}`,
        method: "PATCH",
        body: address,
      }),
    }),
    deleteUserAddress: builder.mutation<
      AddressResponse,
      Omit<addressUserType, "_id">
    >({
      query: (address: addressUserType) => ({
        url: `/address/delete/${address._id}`,
        method: "PATCH",
        body: address,
      }),
    }),
  }),
});
export const {
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} = AddressUserApi;
