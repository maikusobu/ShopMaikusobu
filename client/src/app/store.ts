import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../api/AuthReducer/AuthReduce";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { userApi } from "../api/UserApi/UserApi";
import { productApi } from "../api/ProductReducer/ProductApi";
import { paymentUserApi } from "../api/UserApi/UserPaymentApi";
const rootReducer = combineReducers({
  auth: AuthReducer,
  [userApi.reducerPath]: userApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [paymentUserApi.reducerPath]: paymentUserApi.reducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    userApi.middleware,
    productApi.middleware,
    paymentUserApi.middleware,
    AuthMiddleware,
  ],
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
