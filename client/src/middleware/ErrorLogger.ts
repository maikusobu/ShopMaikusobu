/** @jsxImportSource @emotion/react */
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { toast } from "../toast/toast";
export const ErrorLogger: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      console.warn("We got a rejected action!");
      toast(
        action.error.message,
        true,
        "Async Error",
        "Fetching request error"
      );
    }
    return next(action);
  };
