import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { saveDataURLToBinaryData } from "../../helpers/savedataurl";
import { sign } from "jsonwebtoken";
import { config } from "../../../../config/configJWT";
import asyncHandler from "express-async-handler";
import userModel from "../../models/User_management/userModel";
import shopping_session from "../../models/Shopping_process/shopping_session";
import checkUser from "../../validations/checkPassWord";
import user_addressManagerModel from "../../models/User_management/user_addressManagerModel";
import user_manager_paymentModel from "../../models/User_management/user_manager_paymentModel";
import user_token from "../../models/User_management/user_token";
import user_confirm_number from "../../models/User_management/user_confirm_number";
import { sendEmail } from "../../utils/email/sendMail";
import crypto from "crypto";
import { verify } from "jsonwebtoken";
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
        res.status(400).json({ response, status: 400 });
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
          try {
            await sendEmail(
              userMade.email,
              "Verify Account",
              {
                "user-name": userMade.username,
                "site-name": "ShopMaikusobu",
                "confirm-number": num,
              },
              "requestRegister"
            );
          } catch (err) {
            res.status(500).json({
              response: {
                message: "Cannot send email",
                status: 500,
              },
            });
          }
          res.status(201).json({
            response: {
              message: "Thư xác nhận đã được chuyển đến mail của bạn",
              status: 201,
              id: userMade._id,
              social: req.body.isSocialLogin ? true : false,
            },
          });
        } catch (err: any) {
          if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(
              (error: any) => error.message
            );
            res.status(400).json({
              response: { message: errors, status: 400 },
            });
          } else {
            res.status(500).json({
              response: { message: "Cannot create user", status: 500 },
            });
          }
        }
      }
    } catch (err) {
      return next(err);
    }
  }
);
export const signinMiddeware = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const User = await userModel.findOne({ username: req.body.username });

      if (!User) throw new Error("User not found");
      let match = false;
      if (!User.isVerified) throw new Error("User not verified");
      if (req.body.isSocialLogin) {
        match = true;
      } else {
        match = await checkUser(req.body.password, User?.password);
      }
      if (match) {
        const token = sign({ id: User.id }, process.env.JWT_TOKEN_SECRET, {
          expiresIn: config.tokenLife,
        });
        const refreshT = sign(
          { id: User.id },
          process.env.JWT_REFRESHTOKEN_SECRET,
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
          social: req.body.isSocialLogin ? true : false,
          status: 200,
          id: User?.id,
          username: User?.username,
          expires: new Date(config.tokenLife).getTime().toString(),
        });
      } else {
        throw new Error("not matching password");
      }
    } catch (err: any) {
      res.status(400).json({ message: err.message, status: 400 });
    }
  }
);
export const forgotPasswordMiddeware = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = await userModel.findOne({ username: req.body.username });
      if (!user) throw new Error("User not found");
      if (user.email !== req.body.email) throw new Error("Email not matching");
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
      await sendEmail(
        user.email,
        "Reset Password",
        {
          name: user.username,
          link: link,
        },
        "requestResetPassword"
      );
      res.status(200).json({
        message: "Email sent successfully",
        link: link,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message, status: 400 });
    }
  }
);
export const changePasswordMiddeware = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { user_id, token, password } = req.body;
      const passwordResetToken = await user_token.findOne({ user_id });
      if (!passwordResetToken) throw new Error("Token not found");
      const isValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isValid) throw new Error("Token not valid");
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
      res.status(400).json({ message: err.message, status: 400 });
    }
  }
);
export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log(req.method, req.body);
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    res.status(401).json({ message: "refreshtoken failed" });
  } else
    verify(
      refreshToken,
      process.env.JWT_REFRESHTOKEN_SECRET,
      (err: any, decode: { id: string }) => {
        if (err) {
          res.status(401).json({ message: "refreshtoken failed" });
        }
        const access_token = sign(
          { id: decode.id },
          process.env.JWT_TOKEN_SECRET,
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
      }
    );
};
export const logout = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) res.status(401).json({ message: "Unauthorized" });
  const index = refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    refreshToken.splice(index, 1);
  }
  res.status(200).json({
    message: "Logout successfully",
  });
};
