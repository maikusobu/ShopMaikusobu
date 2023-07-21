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
  const status = statusCode || 500;
  res.status(status).json({
    message,
    statusCode,
  });
};
