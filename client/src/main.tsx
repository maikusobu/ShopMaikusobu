import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./component/validation/login.tsx";
import ErrorProvider from "./component/ErrorContext/ErrorContext.tsx";
import Register from "./component/validation/register.tsx";
import actionLogin from "./component/validation/action/actionLogin.ts";
import actionRegister from "./component/validation/action/actionRegister.ts";
import RestorePassword from "./component/validation/restorePassword.tsx";
import actionChangePassword from "./component/validation/action/actionChangePassword.ts";
import actionRestorePassword from "./component/validation/action/actionrestorePassword.ts";
import ChangePassWord from "./component/validation/changePassword.tsx";
import { Notifications } from "@mantine/notifications";
import Home from "./component/HomePage/Home/Home.tsx";
import { store } from "./app/store.ts";
import { Provider } from "react-redux/es/exports";
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/authen",
    children: [
      {
        path: "login",
        element: <Login />,
        action: actionLogin,
      },
      {
        path: "signup",
        element: <Register />,
        action: actionRegister,
      },
      {
        path: "forgotpassword",
        element: <RestorePassword />,
        action: actionRestorePassword,
      },
      {
        path: "changepassword",
        element: <ChangePassWord />,
        action: actionChangePassword,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        withCSSVariables
        theme={{
          fontFamily: "Lora, serif",
          colorScheme: "dark",
          colors: {
            brandcolorRed: [
              "#F96768",
              "#F4E0E1",
              "#EEBCBC",
              "#EF9495",
              "#E65758",
              "#D14C4D",
              "#BC4445",
              "#9F4848",
              "#874849",
              "#744747",
            ],
            brandcolorYellow: [
              "#FCDF7C",
              "#FDFCF8",
              "#F4EDD3",
              "#F4E3AA",
              "#EBCD68",
              "#D7BB59",
              "#C3A94F",
              "#AC964B",
              "#92824C",
              "#7D724B",
            ],
          },
          globalStyles: (theme) => ({
            "*, *::before, *::after": {
              boxSizing: "border-box",
              padding: 0,
              margin: 0,
            },
            body: {
              overflow: "hidden",
              fontFamily: "Lora, serif",
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
              lineHeight: theme.lineHeight,
            },
          }),
        }}
        withNormalizeCSS
      >
        <ErrorProvider>
          <Notifications />
          <RouterProvider router={router}></RouterProvider>
        </ErrorProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
