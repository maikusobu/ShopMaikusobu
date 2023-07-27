import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
export const LogoutMiddeware: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_api: MiddlewareAPI) => (next) => (action) => {
    console.log(action);

    next(action);
  };
