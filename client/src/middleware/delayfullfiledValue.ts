/** @jsxImportSource @emotion/react */
import { isFulfilled } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
export const delayfullfiledValue: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_api: MiddlewareAPI) => (next) => (action) => {
    if (isFulfilled(action)) {
      setTimeout(() => next(action), 1500);
    } else return next(action);
  };
