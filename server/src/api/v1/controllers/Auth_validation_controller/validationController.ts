import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { Worker } from "worker_threads";
import { saveDataURLToBinaryData } from "../../helpers/savedataurl";
import { sign, verify, VerifyOptions } from "jsonwebtoken";
import { config } from "../../../../config/configJWT";
import asyncHandler from "express-async-handler";
import userModel from "../../models/User_management/userModel";
import shopping_session from "../../models/Shopping_process/shopping_session";
import user_addressManagerModel from "../../models/User_management/user_addressManagerModel";
import user_manager_paymentModel from "../../models/User_management/user_manager_paymentModel";
import user_token from "../../models/User_management/user_token";
import user_confirm_number from "../../models/User_management/user_confirm_number";
import { Unauthorized, Validation } from "../../interfaces/ErrorInstances";
import {
  HttpError,
  MongoDBError,
  NotFound,
} from "../../interfaces/ErrorInstances";
import crypto from "crypto";
const worker = new Worker(
  "./dist/js/api/v1/controllers/services/sendEmailWorker.js"
);
const refreshTokens: string[] = [];
export const signupMiddeware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email } = req.body;
      const user = await userModel.findOne({ $or: [{ username }, { email }] });
      if (user) {
        const response =
          user.username === username
            ? {
                message: "User already exists",
                field: "username",
              }
            : {
                message: "Email already exists",
                field: "email",
              };
        throw new Validation(400, response.message, response.field);
      } else {
        try {
          const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
          const hash = await bcrypt.hash(req.body.password, salt);
          req.body.password = hash;
          req.body.avatar = saveDataURLToBinaryData(req.body.avatar);
          const userMade = new userModel(req.body);
          await userMade.save();
          await Promise.all([
            shopping_session.create({
              user_id: userMade._id,
              cart_items: [],
            }),
            user_addressManagerModel.create({
              user_id: userMade._id,
              address_list: [],
            }),
            user_manager_paymentModel.create({
              user_id: userMade._id,
              payment_list: [],
            }),
          ]);
          const num = Math.floor(Math.random() * 900000) + 100000;
          await user_confirm_number.create({
            user_id: userMade._id,
            numberConfirm: num,
            createdAt: new Date(),
          });

          worker.postMessage({
            email: userMade.email,
            subject: "Verify Account",
            templateData: {
              "user-name": userMade.username,
              "site-name": "ShopMaikusobu",
              "support-email": "shopmaikusobu@gmail.com",
              "confirm-number": num,
            },
            templateName: "requestRegister",
          });
          worker.on("message", (data) => {
            if (data.success) {
              res.status(201).json({
                message: "Thư xác nhận đã được chuyển đến mail của bạn",
                status: 201,
                id: userMade._id,
                social: req.body.isSocialConnect ? true : false,
              });
            } else {
              throw new HttpError(500, "Cannot send email");
            }
          });
        } catch (err: any) {
          if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(
              (error: any) => error.message
            );
            throw new MongoDBError(400, errors);
          } else {
            throw new HttpError(500, "Cannot create user");
          }
        }
      }
    } catch (err) {
      return next(err);
    }
  }
);
export const resendConFirmNumber = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.body;
      const user = await userModel.findById(user_id);
      if (!user) throw new NotFound(404, "User not found");
      await user_confirm_number.deleteMany({ user_id: user_id });
      const num = Math.floor(Math.random() * 900000) + 100000;
      await user_confirm_number.create({
        user_id: user_id,
        numberConfirm: num,
        createdAt: new Date(),
      });
      worker.postMessage({
        email: user.email,
        subject: "Verify Account",
        templateData: {
          "user-name": user.username,
          "site-name": "ShopMaikusobu",
          "support-email": "shopmaikusobu@gmail.com",
          "confirm-number": num,
        },
        templateName: "requestRegister",
      });
      worker.on("message", (data) => {
        if (data.success) {
          res.status(200).json({
            message: "Thư xác nhận đã được chuyển đến mail của bạn",
            status: 201,
            id: user_id,
            social: req.body.isSocialConnect ? true : false,
          });
        } else {
          throw new HttpError(500, "Cannot send email");
        }
      });
    } catch (err) {
      return next(err);
    }
  }
);
export const signinMiddeware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const User = await userModel.findOne({ username: req.body.username });

      if (!User) throw new NotFound(404, "User not found");
      let match = false;
      if (!User.isVerified)
        throw new Validation(401, "User not verified", "username");
      if (req.body.isSocialLogin) {
        match = true;
      } else {
        match = await bcrypt.compare(req.body.password, User?.password);
      }
      if (match) {
        const token = sign(
          { id: User.id },
          process.env.JWT_TOKEN_SECRET as string,
          {
            expiresIn: config.tokenLife,
          }
        );
        const refreshT = sign(
          { id: User.id },
          process.env.JWT_REFRESHTOKEN_SECRET as string,
          {
            expiresIn: config.refreshTokenLife,
          }
        );
        res.cookie("token", token, {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          maxAge: 480 * 1000,
          path: "/",
        });
        refreshTokens.push(refreshT);

        res.status(200).json({
          message: "login sucess",
          refreshToken: refreshT,
          // sessionID: sessionID.id,
          status: 200,
          id: User?.id,
          expires: new Date(config.tokenLife).getTime().toString(),
        });
      } else {
        throw new Validation(400, "not matching password", "password");
      }
    } catch (err: any) {
      return next(err);
    }
  }
);

export const CheckRegisteration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, numberConfirm } = req.body;
      const numberConfirmUser = await user_confirm_number.findOne({
        user_id: user_id,
      });
      if (!numberConfirmUser) throw new NotFound(404, "Cannot found number");
      else if (numberConfirmUser.numberConfirm === numberConfirm) {
        const user = await userModel.findById(user_id);
        if (!user) throw new NotFound(404, "Cannot found user");
        user.isVerified = true;
        await Promise.all([
          user.save(),
          user_confirm_number.findByIdAndDelete(numberConfirmUser._id),
        ]);
        res.status(200).json({ message: "Confirm success", status: 200 });
      }
    } catch (err: any) {
      next(new HttpError(400, err.message));
    }
  }
);
export const forgotPasswordMiddeware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findOne({ username: req.body.username });
      if (!user) throw new NotFound(404, "User not found");
      if (user.email !== req.body.email)
        throw new Validation(401, "Email not matching", "email");
      await user_token.deleteOne({ user_id: user._id });
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(
        resetToken,
        Number(process.env.SALT_ROUND)
      );
      await user_token.create({
        user_id: user._id,
        token: hash,
        createdAt: new Date(),
      });
      const link = `${process.env.URL_CLIENT}/authen/changepassword?token=${resetToken}&id=${user._id}`;
      worker.postMessage({
        email: user.email,
        subject: "Reset Password",
        templateData: {
          name: user.username,
          link: link,
          "support-email": "shopmaikusobu@gmail.com",
          "site-name": "Shopmaikusobu",
        },
        templateName: "requestResetPassword",
      });
      worker.on("message", (data) => {
        if (data.success) {
          res.status(200).json({
            status: 200,
            message: "Email sent successfully",
            link: link,
          });
        } else {
          throw new HttpError(500, "Cannot send email");
        }
      });
    } catch (err: any) {
      return next(err);
    }
  }
);
export const changePasswordMiddeware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, token, password } = req.body;
      const passwordResetToken = await user_token.findOne({ user_id });
      if (!passwordResetToken) throw new NotFound(404, "Token not found");
      const isValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isValid) throw new Unauthorized(401, "Token not valid");
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
      const hash = await bcrypt.hash(password, salt);
      await userModel.findByIdAndUpdate(user_id, {
        $set: { password: hash },
      });
      await user_token.deleteOne({ user_id });
      res.status(200).json({
        message: "Password changed successfully",
        status: 200,
      });
    } catch (err: any) {
      return next(err);
    }
  }
);
export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        throw new NotFound(404, "Not found refresh token");
      } else
        verify(
          refreshToken,
          process.env.JWT_REFRESHTOKEN_SECRET as string,
          ((err: any, decode: { id: string }) => {
            if (err) {
              throw new Unauthorized(401, "In valid refresh token");
            }
            const access_token = sign(
              { id: decode.id },
              process.env.JWT_TOKEN_SECRET as string,
              {
                expiresIn: config.tokenLife,
              }
            );
            res.cookie("token", access_token, {
              secure: true,
              sameSite: "none",
              httpOnly: true,
              maxAge: 480 * 1000,
              path: "/",
            });
            res.status(200).json({
              refreshToken: refreshToken,
              status: 200,
            });
          }) as VerifyOptions
        );
    } catch (err) {
      return next(err);
    }
  }
);
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new NotFound(404, "Not found refresh token");
      // const sessionID = await sessionID.findOne({ refreshToken }")
      const index = refreshTokens.indexOf(refreshToken);
      if (index !== -1) {
        refreshTokens.splice(index, 1);
      }
      // await sessionID.findByIdAndDelete(sessionID);
      res.cookie("token", "", {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 480 * 1000,
        path: "/",
      });
      res.status(200).json({
        message: "Logout successfully",
      });
    } catch (err) {
      return next(err);
    }
  }
);