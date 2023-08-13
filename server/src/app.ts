import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
require("dotenv").config();
import { createServer } from "http";
import { Server } from "socket.io";
import { dirPath } from "./api/v1/helpers/returnUrl";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
const MONGO_URL = process.env.MONGO_URL;
const URL_CLIENT = process.env.URL_CLIENT;
import userModel from "./api/v1/models/User_management/userModel";
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
import conversationModel from "./api/v1/models/User_Chat_management/conversationMode";
import sessionModel from "./api/v1/models/User_Chat_management/sessionModel";
import messageModel from "./api/v1/models/User_Chat_management/messageModel";

//config express

// const corsOptions = {
//   credentials: true,
//   origin: "http://localhost:5173",
//   methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "HEAD"],
//   exposedHeaders: ["set-cookie"],
//   maxAge: 864000,
// };
// if (cluster.isPrimary) {
//   console.log(`Master ${process.pid} is running`);

//   for (let i = 0; i < 4; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });

//   const app: Express = express();
//   const httpServer = createServer(app);
//   setupMaster(httpServer, {
//     loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
//   });
//   const PORT = process.env.PORT || 3001;

//   httpServer.listen(PORT, () =>
//     console.log(`server listening at http://localhost:${PORT}`)
//   );
// } else {

const app: Express = express();
const httpServer = createServer(app);

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
// socket config
const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:5173"], credentials: true },
});
io.use(async (socket, next) => {
  const id = socket.handshake.auth.userID;
  if (!id) return next(new Error("No User Id"));
  const user = await userModel.findById(id);
  if (socket.handshake.auth.sessionID) {
    const session = await sessionModel.findById(
      socket.handshake.auth.sessionID
    );
    if (session) {
      socket.data.username = session.username;
      socket.data.sessionID = session.id;
      return next();
    }
  } else {
    const session = await sessionModel.findOne({ userID: id });
    if (session) {
      socket.data.username = session.username;

      socket.data.sessionID = session.id;
      return next();
    }
  }

  if (!user) {
    return next(new Error("Not have that user"));
  }
  socket.data.username = user.username;
  next();
});
io.on("connection", async (socket) => {
  socket.join(socket.handshake.auth.userID);
  let sessionID: string = "";
  if (!socket.data.sessionID) {
    sessionID = (
      await sessionModel.create({
        userID: socket.handshake.auth.userID,
        username: socket.data.username,
        connected: true,
      })
    ).id;
  } else {
    sessionID = (await sessionModel.findByIdAndUpdate(
      socket.data.sessionID,
      {
        connected: true,
      },
      { new: true }
    ))!.id;
  }

  socket.emit("session", {
    userID: socket.handshake.auth.userID,
    sessionID: sessionID,
  });
  const users: any[] = [];
  // let [conversations, sessions] = await Promise.all([
  //   conversationModel
  //     .find({ "participants.participant_id": socket.handshake.auth.userID })
  //     .populate("messages"),
  //   sessionModel.find(),
  // ]);
  // if (conversations.length === 0) {
  //   sessions.forEach(async (session) => {
  //     if (session.userID.toString() !== socket.handshake.auth.userID) {
  //       await conversationModel.create({
  //         participants: [
  //           {
  //             participant_id: socket.handshake.auth.userID,
  //             hasNewMessage: false,
  //           },
  //           {
  //             participant_id: session.userID,
  //             hasNewMessage: false,
  //           },
  //         ],
  //         messages: [],
  //       });
  //     } else {
  //     }
  //   });
  //   conversations = await conversationModel
  //     .find({ "participants.participant_id": socket.handshake.auth.userID })
  //     .populate("messages");
  // }

  // sessions.forEach((session) => {
  //   if (session.userID.toString() === socket.handshake.auth.userID) {
  //   } else {
  //     users.push({
  //       userID: session.userID,
  //       username: session.username,
  //       connected: session.connected,
  //       conversations: conversations.filter((conversation) => {
  //         return (
  //           conversation.participants.some(
  //             (participant) =>
  //               participant.participant_id?.toString() ===
  //               session.userID.toString()
  //           ) &&
  //           conversation.participants.some(
  //             (participant) =>
  //               participant.participant_id?.toString() ===
  //               socket.handshake.auth.userID
  //           )
  //         );
  //       }),
  //     });
  //   }
  // });
  let [conversations, sessions] = await Promise.all([
    conversationModel
      .find({ "participants.participant_id": socket.handshake.auth.userID })
      .populate("messages"),
    sessionModel.find(),
  ]);

  sessions.forEach(async (session) => {
    if (session.userID.toString() !== socket.handshake.auth.userID) {
      const existingConversation = conversations.find((conversation) =>
        conversation.participants.some(
          (participant) =>
            participant.participant_id?.toString() === session.userID.toString()
        )
      );
      if (!existingConversation) {
        await conversationModel.create({
          participants: [
            {
              participant_id: socket.handshake.auth.userID,
              hasNewMessage: false,
            },
            {
              participant_id: session.userID,
              hasNewMessage: false,
            },
          ],
          messages: [],
        });
      }
    }
  });

  conversations = await conversationModel
    .find({ "participants.participant_id": socket.handshake.auth.userID })
    .populate("messages");

  sessions.forEach((session) => {
    if (session.userID.toString() !== socket.handshake.auth.userID) {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        conversations: conversations.filter((conversation) => {
          return (
            conversation.participants.some(
              (participant) =>
                participant.participant_id?.toString() ===
                session.userID.toString()
            ) &&
            conversation.participants.some(
              (participant) =>
                participant.participant_id?.toString() ===
                socket.handshake.auth.userID
            )
          );
        }),
      });
    }
  });
  socket.emit("users", users);
  socket.broadcast.emit("user connected", {
    userID: socket.handshake.auth.userID,
    username: socket.data.username,
    conversations: conversations.filter((conversation) => {
      return conversation.participants.some(
        (participant) =>
          participant.participant_id?.toString() ===
          socket.handshake.auth.userID
      );
    }),
    connected: true,
  });
  socket.on("private message", async ({ content, to }) => {
    const message = { content, from: socket.handshake.auth.userID, to };
    io.to([to, socket.handshake.auth.userID]).emit("private message", message);

    const new_message = await messageModel.create(message);
    await conversationModel.findOneAndUpdate(
      {
        $and: [
          { "participants.participant_id": socket.handshake.auth.userID },
          { "participants.participant_id": to },
        ],
      },
      {
        $set: {
          "participants.$[user1].hasNewMessage": true,
          "participants.$[user2].hasNewMessage": true,
        },
        $push: {
          messages: new_message._id,
        },
      },
      {
        arrayFilters: [
          { "user1.participant_id": socket.handshake.auth.userID },
          { "user2.participant_id": to },
        ],
      }
    );
  });
  socket.on("typing", (data) => {
    socket.to(data.userID).emit("typing", data);
  });
  socket.on("newMessageCheck", async (userID) => {
    await conversationModel.findOneAndUpdate(
      {
        $and: [
          { "participants.participant_id": socket.handshake.auth.userID },
          { "participants.participant_id": userID },
        ],
      },
      {
        $set: {
          "participants.$[user].hasNewMessage": false,
        },
      },
      {
        arrayFilters: [{ "user.participant_id": userID }],
      }
    );
  });
  socket.on("disconnect", async () => {
    const matchingSockets = await io
      .in(socket.handshake.auth.userID)
      .fetchSockets();
    const isDisconnected = matchingSockets.length === 0;
    if (isDisconnected) {
      socket.broadcast.emit("user disconnected", socket.handshake.auth.userID);
      await sessionModel.findOneAndUpdate(
        { userID: socket.handshake.auth.userID },
        {
          connected: false,
        }
      );
    }
  });
});

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
const excludePaths = [/^\/products\/(.*)/, /^\/authen\/(.*)/, "/products"];
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

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
