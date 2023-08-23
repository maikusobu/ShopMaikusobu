import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "../api/AuthReducer/AuthReduce";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { AnyAction, PreloadedState, ThunkAction } from "@reduxjs/toolkit";
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

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      baseApi.middleware,
      ProvincesAPi.middleware,
      AuthMiddleware,
      LogoutMiddeware,
      ErrorLogger,
    ],
    preloadedState,
  });
};

export const store = setupStore();
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
