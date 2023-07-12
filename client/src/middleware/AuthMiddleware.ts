import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";

import { Logout } from "../api/AuthReducer/AuthReduce";
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function

export const AuthMiddleware: Middleware =
  (storeApi: MiddlewareAPI) => (next) => (action) => {
    console.log("log middleware");
    if (storeApi.getState().auth.expiresAt > 0) {
      if (storeApi.getState().auth.expiresAt < Date.now()) {
        storeApi.dispatch(Logout());
        return;
      }
      next(action);
    }

    next(action);
  };
