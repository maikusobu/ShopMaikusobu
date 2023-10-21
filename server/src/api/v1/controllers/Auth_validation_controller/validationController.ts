/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import asyncHandler from "express-async-handler";
import {
  signupService,
  signinService,
  resendConfirmNumberService,
  checkRegistrationService,
  forgotPasswordService,
  changePasswordService,
  refreshTokenService,
  logoutService,
} from "../../services/validationService";

export const signupMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await signupService(req.body);
      console.log(result);
      res.status((result as any).status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

export const signinMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await signinService(req.body);
      res.cookie("token", result.token, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 480 * 1000,
        path: "/",
      });
      res.status(result.status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

export const resendConfirmNumberMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await resendConfirmNumberService(req.body);
      res.status((result as any).status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

export const checkRegistrationMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await checkRegistrationService(req.body);
      res.status(result.status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

export const forgotPasswordMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await forgotPasswordService(req.body);
      res.status((result as any).status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

export const changePasswordMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await changePasswordService(req.body);
      res.status(result.status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

export const refreshTokenMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await refreshTokenService(req.body);
      res.cookie("token", (result as any).access_token, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 480 * 1000,
        path: "/",
      });
      res.status((result as any).status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);

export const logoutMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await logoutService(req.body);
      res.cookie("token", "", {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 480 * 1000,
        path: "/",
      });
      res.status(result.status).json(result);
    } catch (err) {
      return next(err);
    }
  }
);
