import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../api/AuthReducer/AuthReduce";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { baseApi } from "../api/BaseApi/baseApi";
import { ProvincesAPi } from "../api/VnProvincesApi/VnProvincesApi";
import { ErrorLogger } from "../middleware/ErrorLogger";
import { LogoutMiddeware } from "../middleware/logoutMiddeware";
import OrderReducer from "../api/OrderReducer/OrderReducer";
const rootReducer = combineReducers({
  auth: AuthReducer,
  order: OrderReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [ProvincesAPi.reducerPath]: ProvincesAPi.reducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    baseApi.middleware,
    ProvincesAPi.middleware,
    AuthMiddleware,
    LogoutMiddeware,
    ErrorLogger,
  ],
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
