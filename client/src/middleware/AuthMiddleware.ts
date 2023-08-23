import { Middleware } from "@reduxjs/toolkit";
export const AuthMiddleware: Middleware = () => (next) => (action) => {
  // console.log("log middleware");
  // if (storeApi.getState().auth.expiresAt > 0) {
  //   if (storeApi.getState().auth.expiresAt < Date.now()) {
  //     storeApi.dispatch(Logout());
  //   }
  // }

  next(action);
};
