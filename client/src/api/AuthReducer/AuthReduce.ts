import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
type AuthState = {
  isLoggedIn: boolean;
  id: string;
  expiresAt: number;
  refreshToken: string;
};
const initialState: AuthState = {
  isLoggedIn: false,
  id: "",
  expiresAt: 0,
  refreshToken: "",
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    Logout(state) {
      state.isLoggedIn = false;
      state.id = "";
      state.refreshToken = "";
      localStorage.clear();
    },
    Login(state, action: PayloadAction<Omit<AuthState, "isLoggedIn">>) {
      state.id = action.payload.id;
      state.isLoggedIn = true;
      state.expiresAt = action.payload.expiresAt;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});
export const { Logout, Login } = AuthSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default AuthSlice.reducer;
