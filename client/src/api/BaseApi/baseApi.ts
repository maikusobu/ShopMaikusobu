/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import { toast } from "../../toast/toast";
import { checkLogout } from "../../app/thunkDispatch/thunkLogout";
import { Mutex } from "async-mutex";

import { AnyAction } from "@reduxjs/toolkit";
const mutex = new Mutex();
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
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
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
          if ((api.getState() as RootState).auth.isLoggedIn)
            api.dispatch(checkLogout() as unknown as AnyAction);
          if (window.location.pathname !== "/") {
            toast(
              "Vui lòng đăng nhập lại",
              true,
              "authorized",
              "Not authorized"
            );
            const newpath = "authen/login";
            const url = new URL(window.location.href);
            url.search = "";
            url.pathname = "/" + newpath;
            window.location.replace(url.toString());
          } else {
            if (api.endpoint === "createCart") {
              toast(
                "Vui lòng đăng nhập lại",
                true,
                "authorized",
                "Not authorized"
              );
            }
          }
          return refreshResult;
        } else if (
          "status" in (refreshResult.data as any) &&
          refreshResult.data
        ) {
          result = await baseQuery(args, api, extraOptions);
          if (result.error) {
            console.log(result.error);
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
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
