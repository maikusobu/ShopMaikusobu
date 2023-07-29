import React from "react";
import ReactDOM from "react-dom/client";
import dayjs from "dayjs";
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
import ProductPage from "./component/ShoppingHome/ProductPage/ProductPage.tsx";
import { Notifications } from "@mantine/notifications";
import SettingAccount from "./component/SettingAccount/SettingAccount.tsx";
import PaymentProvider from "./component/ModalAddPayment/ModalAddPayment.tsx";
import AddressProvider from "./component/ModalAddAddress/ModalAddAddress.tsx";
import CartPage from "./component/CartComponent/CartPage/CartPage.tsx";
import Home from "./component/HomePage/Home/Home.tsx";
import CheckOut from "./component/CheckOutComponent/CheckOutPage.tsx";
import ShoppingHome from "./component/ShoppingHome/shoppinghome.tsx";
import { loader as searchLoader } from "./component/Search/searchAction.ts";
import { ModalProVider } from "./component/ModalContext/ModalContext.tsx";
import ContentShow from "./component/ShoppingHome/ContentShow/ContentShow.tsx";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";

import { DatesProvider } from "@mantine/dates";
import "./index.css";
const locale = {
  name: "vi",
  weekdays: "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),
  months:
    "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split(
      "_"
    ),
  weekStart: 1,
  weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
  monthsShort:
    "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),
  weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split("_"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ordinal: (n: any) => n,
  formats: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM [năm] YYYY",
    LLL: "D MMMM [năm] YYYY HH:mm",
    LLLL: "dddd, D MMMM [năm] YYYY HH:mm",
    l: "DD/M/YYYY",
    ll: "D MMM YYYY",
    lll: "D MMM YYYY HH:mm",
    llll: "ddd, D MMM YYYY HH:mm",
  },
  relativeTime: {
    future: "%s tới",
    past: "%s trước",
    s: "vài giây",
    m: "một phút",
    mm: "%d phút",
    h: "một giờ",
    hh: "%d giờ",
    d: "một ngày",
    dd: "%d ngày",
    M: "một tháng",
    MM: "%d tháng",
    y: "một năm",
    yy: "%d năm",
  },
};
dayjs.locale(locale);
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
      {
        path: "noauthorized",
        element: <div>Bạn không có quyền truy cập</div>,
      },
    ],
  },
  {
    path: "/shopping",

    children: [
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckOut />,
      },
      {
        path: "products",
        element: <ShoppingHome />,
        children: [
          {
            path: "all",
            element: <ContentShow />,
          },
          {
            path: ":id",
            element: <ProductPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/settingaccount",
    element: <SettingAccount />,
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
              overflowX: "hidden",
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
          <DatesProvider
            settings={{
              locale: "vi",
              firstDayOfWeek: 0,
            }}
          >
            <ModalProVider>
              <AddressProvider>
                <PaymentProvider>
                  <Notifications />
                  <RouterProvider router={router}></RouterProvider>
                </PaymentProvider>
              </AddressProvider>
            </ModalProVider>
          </DatesProvider>
        </ErrorProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
