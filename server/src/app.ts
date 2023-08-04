import express, { Express, Request, Response } from "express";

import helmet from "helmet";
import cookieParser from "cookie-parser";
require("dotenv").config();

import { dirPath } from "./api/v1/helpers/returnUrl";
import mongoose from "mongoose";
const morgan = require("morgan");
const bodyParser = require("body-parser");
const MONGO_URL = process.env.MONGO_URL;

const URL_CLIENT = process.env.URL_CLIENT;
import authMiddleware from "./api/v1/controllers/services/AuthMiddleware";
import { ErrorFunction } from "./api/v1/middlewares/errorHandling";
import authenRouter from "./api/v1/routes/User_management_routes/validation";
import userRouter from "./api/v1/routes/User_management_routes/user";
import productRouter from "./api/v1/routes/Product_management_routes/product";
import paymenManagerRouter from "./api/v1/routes/User_management_routes/userPaymentManager";
import addressManagerRouter from "./api/v1/routes/User_management_routes/userAddressManager";
import ShoppingRouter from "./api/v1/routes/Shopping_process_routes/shopping_sesssion";
import CartItemRouter from "./api/v1/routes/Shopping_process_routes/cart_item";
import paymentRouter from "./api/v1/routes/User_management_routes/userPayment";
import addressRouter from "./api/v1/routes/User_management_routes/userAddress";
import OrderRouter from "./api/v1/routes/Shopping_process_routes/order_item";
//config express

// const corsOptions = {
//   credentials: true,
//   origin: "http://localhost:5173",
//   methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "HEAD"],
//   exposedHeaders: ["set-cookie"],
//   maxAge: 864000,
// };
const app: Express = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});
// app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

//mongo running
mongoose.set("strictQuery", false);
connect();
async function connect() {
  try {
    await mongoose.connect(MONGO_URL as string);
    console.log("mongoDB connected");
  } catch (err) {
    console.error(err);
  }
}
//static files
app.use(express.static(dirPath));
// mongo after initiated
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});
//excluded paths
const excludePaths = [/^\/products\/(.*)/, /^\/authen\/(.*)/];
app.use(authMiddleware.unless({ path: excludePaths }));

// route handling
app.use("/authen", authenRouter);
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/paymentmanager", paymenManagerRouter);
app.use("/addressmanager", addressManagerRouter);
app.use("/address", addressRouter);
app.use("/payment", paymentRouter);
app.use("/shopping", ShoppingRouter);
app.use("/cart-item", CartItemRouter);
app.use("/order", OrderRouter);
app.get("/", (req: Request, res: Response) => {
  console.log(URL_CLIENT);
  res.redirect(`${URL_CLIENT}`);
});
// error handling
app.use(ErrorFunction);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
