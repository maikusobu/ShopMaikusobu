/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import {
  HttpError,
  Validation,
  NotFound,
  Unauthorized,
  MongoDBError,
} from "../interfaces/ErrorInstances";

export const ErrorFunction = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(typeof err);
  if (err instanceof HttpError) {
    res.status(err.status).json({
      type: "HttpError",
      message: err.message,
      status: err.status,
    });
  } else if (err instanceof Validation) {
    res.status(err.status).json({
      type: "Validation",
      status: err.status,
      message: err.message,
      field: err.field,
    });
  } else if (err instanceof NotFound) {
    res.status(err.status).json({
      type: "NotFound",
      status: err.status,
      message: "Not found resources",
    });
  } else if (err instanceof Unauthorized) {
    res.status(err.status).json({
      type: "Unauthorized",
      message: err.message,
      status: err.status,
    });
  } else if (err instanceof MongoDBError) {
    res.status(err.status).json({
      type: "MongoDBError",
      message: err.message,
      error: err.error,
      status: err.status,
    });
  } else {
    res.status(500).json({
      type: "InternalServerError",
      message: err.message,
      status: 500,
    });
  }
};
