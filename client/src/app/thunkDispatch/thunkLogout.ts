import type { AppThunk } from "../thunk";
import type { AnyAction } from "@reduxjs/toolkit";
import { Logout } from "../../api/AuthReducer/AuthReduce";
export function checkLogout(): AppThunk {
  return async function checkLogoutThunk(dispatch, getState) {
    await fetch(`${import.meta.env.VITE_SERVER}/authen/logout`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        refreshToken: getState().auth.refreshToken
          ? getState().auth.refreshToken
          : "",
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    dispatch(Logout());
  };
}
