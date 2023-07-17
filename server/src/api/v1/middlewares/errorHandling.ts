import { Request, Response, NextFunction } from "express";
import HttpError from "../interfaces/HttpError";
export const ErrorFunction: (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => void = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    message,
    statusCode,
  });
};
