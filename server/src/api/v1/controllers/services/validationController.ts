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
          req.body.avatar = saveDataURLToBinaryData(req.body.avatar); // as the name suggested, this code convert dataurl to file
          // delete req.body.avatar; // no need to handle avatar anymore
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
          res.status(201).json({
            response: {
              message: "User created successfully",
              status: 201,
              social: req.body.isSocialLogin ? true : false,
            },
          });
        } catch (err: any) {
          console.log(err);
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
          maxAge: 86500 * 1000,
          path: "/",
        });
        refreshTokens.push(refreshT);
        // let SessionData = req.session;
        // SessionData.token = token;
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
      res.status(200).json({
        message: "Correct Email and Username",
        status: 200,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message, status: 400 });
    }
  }
);
export const changePasswordMiddeware = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      await userModel.findOneAndUpdate(
        { username: req.body.username },
        {
          $set: { password: req.body.password },
        }
      );
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
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    res.status(403).json({ message: "Unauthorized" });
  }
  verify(
    refreshToken,
    process.env.JWT_REFRESHTOKEN_SECRET,
    (err: any, decode: { id: string }) => {
      if (err) {
        res.status(403).json({ message: "Unauthorized" });
      }
      const access_token = sign(
        decode.id,
        process.env.JWT_TOKEN_SECRET,
        config.tokenLife
      );
      req.cookies.token = access_token;
      res.status(200).json({
        refreshToken: refreshToken,
        status: 200,
      });
    }
  );
};
export const logout = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) res.status(403).json({ message: "Unauthorized" });
  const index = refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    refreshToken.splice(index, 1);
  }
  res.status(200).json({
    message: "Logout successfully",
  });
};
