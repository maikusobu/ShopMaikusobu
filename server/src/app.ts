import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
import { dirPath } from "./api/v1/helpers/returnUrl";
import mongoose from "mongoose";
const morgan = require("morgan");
const bodyParser = require("body-parser");
const MONGO_URL = process.env.MONGO_URL;
import authenRouter from "./api/v1/routes/User_management_routes/validation";
import userRouter from "./api/v1/routes/User_management_routes/user";
interface HttpError extends Error {
  statusCode?: number;
}
//config express
require("dotenv").config();
const corsOptions = {
  origin: "*",
};
const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
//mongo running
mongoose.set("strictQuery", false);
connect();
async function connect() {
  try {
    await mongoose.connect(MONGO_URL as string);
  } catch (err) {
    console.error(err);
  }
}
//static files
app.use(express.static(dirPath));
// mongo after initiated
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});
// route handling
app.use("/authen", authenRouter);
app.use("/user", userRouter);
app.get("/", (req: Request, res: Response) => {
  res.redirect("http://localhost:5173/");
});

// error handling
app.use(
  (err: HttpError, req: Request, res: Response, next: NextFunction): void => {
    switch (err.statusCode) {
      case 400:
        res.status(400).json({
          message: "Bad Request",
        });
        break;
      case 401:
        res.status(401).json({
          message: "Unauthorized",
        });
        break;
      case 403:
        res.status(403).json({
          message: "Forbidden",
        });
        break;
      case 404:
        res.status(404).json({
          message: "Not Found",
        });
        break;
      default:
        res.status(500).json({
          message: "Internal Server Error",
        });
    }
  }
);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
