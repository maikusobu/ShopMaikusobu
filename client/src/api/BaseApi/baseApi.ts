/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_SERVER}`,
  prepareHeaders(headers) {
    return headers;
  },
  credentials: "include",
});
const baseQueryWithRefreshT = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "authen/refreshToken",
        body: (api.getState() as RootState).auth.refreshToken,
        method: "POST",
      },
      api,
      extraOptions
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (
      "status" in (refreshResult.data as any) &&
      (refreshResult.data as any).status === 200
    ) {
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
export const baseApi = createApi({
  baseQuery: baseQueryWithRefreshT,
  tagTypes: [
    "Cart",
    "Shopping",
    "Product",
    "User",
    "Payment",
    "Address",
    "Order",
  ],
  endpoints: () => ({}),
});
