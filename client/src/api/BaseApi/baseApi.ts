import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}` }),
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
