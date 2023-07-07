import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Logout } from "../api/AuthReducer/AuthReduce";
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function
console.log("log middleware");
export const AuthMiddleware: Middleware<object, RootState> =
  (storeApi) => (next) => (action) => {
    // // if both conditions are true, dispatch the logout action and clear localStorage
    if (storeApi.getState().auth.expiresAt > 0) {
      if (storeApi.getState().auth.expiresAt < Date.now()) {
        storeApi.dispatch(Logout());
        return;
      }
      next(action);
    }
    // // otherwise, pass the action to the next middleware
    next(action);
  };
