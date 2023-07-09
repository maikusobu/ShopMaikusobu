/** @jsxImportSource @emotion/react */
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";

import { notifications } from "@mantine/notifications";
export const ErrorLogger: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      console.warn("We got a rejected action!");
      notifications.show({
        id: "AsyncError",
        withCloseButton: true,
        onClose: () => console.log("unmounted"),
        onOpen: () => console.log("mounted"),
        autoClose: 5000,
        title: "Fetching async bị lỗi",
        message: action.error.data.message,
        color: "red",
      });
    }
    return next(action);
  };
