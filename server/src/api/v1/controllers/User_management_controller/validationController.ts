import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { saveDataURLToFile } from "../../helpers/savedataurl";
import { generateToken } from "../../validations/generateToken";
import asyncHandler from "express-async-handler";
import userModel from "../../models/User_management/userModel";
import shopping_session from "../../models/Shopping_process/shopping_session";
import checkUser from "../../validations/checkPassWord";
import user_addressManagerModel from "../../models/User_management/user_addressManagerModel";
import user_manager_paymentModel from "../../models/User_management/user_manager_paymentModel";
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
          saveDataURLToFile(req.body.avatar, req.body.username);
          delete req.body.avatar;

          const userMade = new userModel(req.body);
          await userMade.save();
          await shopping_session.create({
            user_id: userMade._id,
            cart_items: [],
          });
          await user_addressManagerModel.create({
            user_id: userMade._id,
            address_list: [],
          });
          await user_manager_paymentModel.create({
            user_id: userMade._id,
            payment_list: [],
          });
          res.status(201).json({
            response: { message: "User created successfully", status: 201 },
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
      console.log(req.body);
      const User = await userModel.findOne({ username: req.body.username });
      if (!User) throw new Error("User not found");
      const match = await checkUser(req.body.password, User?.password);
      if (match) {
        const token = generateToken(User.id);
        res.cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          secure: true,
          httpOnly: true,
        });
        res
          .status(200)
          .json({
            message: "login sucess",
            status: 200,
            id: User?.id,
            username: User?.username,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .getTime()
              .toString(),
          })
          .redirect("/");
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
