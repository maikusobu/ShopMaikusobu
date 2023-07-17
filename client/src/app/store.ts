import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../api/AuthReducer/AuthReduce";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { baseApi } from "../api/BaseApi/baseApi";
import { ErrorLogger } from "../middleware/ErrorLogger";
const rootReducer = combineReducers({
  auth: AuthReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    baseApi.middleware,
    AuthMiddleware,
    ErrorLogger,
  ],
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
