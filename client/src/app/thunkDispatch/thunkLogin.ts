import { Login } from "../../api/AuthReducer/AuthReduce";
import type { AppThunk } from "../thunk";
export function checkLogin(): AppThunk {
  return function checkLoginThunk(dispatch, getState) {
    const auth = getState().auth;
    const id = localStorage.getItem("id");
    const expiresAt = localStorage.getItem("expires");
    if (id && expiresAt && !auth.isLoggedIn) {
      dispatch(
        Login({
          id,
          expiresAt: Number(expiresAt),
        })
      );
    }
  };
}
