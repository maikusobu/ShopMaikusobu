import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { dirPath } from "./api/v1/helpers/returnUrl";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import { configEnv } from "./config/configEnv";
const MONGO_URL = configEnv.mongoUrl;
// import cors from "cors";
const URL_CLIENT = configEnv.urlClient;
import { socketMiddleware } from "./api/v1/socketConnection/socketMiddleware";
import authMiddleware from "./api/v1/middlewares/AuthMiddleware";
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
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  InterServerEvents,
} from "./types/socketType";
import {
  handleConnection,
  handleDisconnection,
  handleNewMessageCheck,
  handleTyping,
  handlePrivateMessage,
} from "./api/v1/socketConnection/Register/handlers";
// import cluster from "cluster";
// import { setupMaster, setupWorker } from "@socket.io/sticky";
// import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
// const numCPUs = 1;
const app: Express = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: { origin: `${URL_CLIENT}`, credentials: true },
});
app.use(bodyParser.json({ limit: "10mb" }));
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
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});
const excludePaths = [/^\/products\/(.*)/, /^\/authen\/(.*)/, "/products"];
app.use(authMiddleware.unless({ path: excludePaths }));
app.use(express.static(dirPath));
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
  res.redirect(`${URL_CLIENT}`);
});
app.use(ErrorFunction);
console.log(process.memoryUsage().heapUsed / 1024 / 1024);

// if (cluster.isPrimary) {
//   setupMaster(httpServer, {
//     loadBalancingMethod: "least-connection",
//   });
//   setupPrimary();
//   console.log(`Master ${process.pid} is running`);
//   const PORT = process.env.PORT || 3001;
//   httpServer.listen(PORT, () =>
//     console.log(`server listening at http://localhost:${PORT}`)
//   );
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);
//   io.adapter(createAdapter());
//   io.use(socketMiddleware);
//   io.on("connection", async (socket) => {
//     handleConnection(socket);
//     handlePrivateMessage(socket, io);
//     handleTyping(socket);
//     handleNewMessageCheck(socket);
//     handleDisconnection(socket, io);
//   });
//   setupWorker(io);
// }
io.use(socketMiddleware);
io.on("connection", async (socket) => {
  handleConnection(socket);
  handlePrivateMessage(socket, io);
  handleTyping(socket);
  handleNewMessageCheck(socket);
  handleDisconnection(socket, io);
});
const PORT = configEnv.port || 3001;
httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
export default app;
