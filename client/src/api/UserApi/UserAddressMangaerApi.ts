import { baseApi } from "../BaseApi/baseApi";
export type addressUserType = {
  _id: string;
  province_code: string;
  district_code: string;
  user_id?: string;
  ward_code?: string;
  address_line_option?: string;
};
export type AddressManagerApiType = {
  user_id: string;
  address_list: addressUserType[];
};
type addressParam = {
  address_id: string;
  user_id: string;
};
const AddressManagerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserAddresses: builder.query<AddressManagerApiType, string>({
      query: (id: string) => `/addressmanager/${id}`,
      providesTags: ["Address"],
    }),
    updateInsertAddress: builder.mutation<AddressManagerApiType, addressParam>({
      query: (address: addressParam) => {
        return {
          url: `/addressmanager/update-insert/${address.user_id}`,
          method: "PATCH",
          body: address,
        };
      },
      invalidatesTags: ["Address"],
    }),
    updateDeleteAddress: builder.mutation<AddressManagerApiType, addressParam>({
      query: (address: addressParam) => {
        return {
          url: `/addressmanager/update-delete/${address.user_id}`,
          method: "PATCH",
          body: address,
        };
      },
    }),
  }),
});
export const {
  useGetUserAddressesQuery,
  useUpdateInsertAddressMutation,
  useUpdateDeleteAddressMutation,
} = AddressManagerApi;
