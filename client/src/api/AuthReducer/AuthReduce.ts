import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
type AuthState = {
  isLoggedIn: boolean;
  id: string;
  username: string;
  expiresAt: number;
};
const initialState: AuthState = {
  isLoggedIn: false,
  id: "",
  username: "",
  expiresAt: 0,
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    Logout(state) {
      state.isLoggedIn = false;
      state.id = "";
      state.username = "";
      localStorage.clear();
    },
    Login(state, action: PayloadAction<Omit<AuthState, "isLoggedIn">>) {
      state.id = action.payload.id;
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.expiresAt = action.payload.expiresAt;
    },
  },
});
export const { Logout, Login } = AuthSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default AuthSlice.reducer;
