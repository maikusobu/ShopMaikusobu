/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { redirect } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import type { RootState } from "../../app/store";
import { Logout } from "../AuthReducer/AuthReduce";
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_SERVER}`,
  prepareHeaders: (headers) => {
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
    console.log((api.getState() as RootState).auth.refreshToken);
    const refreshResult = await baseQuery(
      {
        url: "authen/refreshToken",
        method: "POST",
        body: JSON.stringify({
          refreshToken: (api.getState() as RootState).auth.refreshToken,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      api,
      extraOptions
    );
    if (refreshResult.error) {
      console.log(refreshResult.error);
      api.dispatch(Logout());
      redirect("/");

      notifications.show({
        message: "You are unauthorized. Please log in again.",
        color: "red",
      });
      return refreshResult;
    }
    if (
      "status" in (refreshResult.data as any) &&
      (refreshResult.data as any).status === 200
    ) {
      result = await baseQuery(args, api, extraOptions);
      if (result.error) {
        console.log(result.error);
      }
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
