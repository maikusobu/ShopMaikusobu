/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import { Worker } from "worker_threads";
import { saveDataURLToBinaryData } from "../helpers/savedataurl";
import { sign, verify, VerifyOptions } from "jsonwebtoken";
import userModel from "../models/User_management/userModel";
import shopping_session from "../models/Shopping_process/shopping_session";
import user_addressManagerModel from "../models/User_management/user_addressManagerModel";
import user_manager_paymentModel from "../models/User_management/user_manager_paymentModel";
import user_token from "../models/User_management/user_token";
import user_confirm_number from "../models/User_management/user_confirm_number";
import {
  HttpError,
  MongoDBError,
  NotFound,
  Unauthorized,
  Validation,
} from "../interfaces/ErrorInstances";
import crypto from "crypto";
import { config } from "../../../config/configJwt";
import { configEnv } from "../../../config/configEnv";
const worker = new Worker(
  "./dist/js/api/v1/controllers/Auth_validation_controller/sendEmailWorker.js"
);
interface dataType {
  success: boolean;
}
const refreshTokens: string[] = [];
export const signupService = async (reqBody: any) => {
  const { username, email } = reqBody;
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
      const salt = await bcrypt.genSalt(Number(configEnv.saltRound));
      const hash = await bcrypt.hash(reqBody.password, salt);
      reqBody.password = hash;
      reqBody.avatar = saveDataURLToBinaryData(reqBody.avatar);
      const userMade = new userModel(reqBody);
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

      const data: dataType = await new Promise((resolve, reject) => {
        worker.on("message", resolve);
        worker.on("error", reject);
      });

      if (data.success) {
        return {
          message: "Thư xác nhận đã được chuyển đến mail của bạn",
          status: 201,
          id: userMade._id,
          social: reqBody.isSocialConnect ? true : false,
        };
      } else {
        throw new HttpError(500, "Cannot send email");
      }
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
};

export const signinService = async (reqBody: any) => {
  const User = await userModel.findOne({ username: reqBody.username });
  if (!User) throw new NotFound(404, "User not found");
  let match = false;
  if (!User.isVerified)
    throw new Validation(401, "User not verified", "username");
  if (reqBody.isSocialLogin) {
    match = true;
  } else {
    match = await bcrypt.compare(reqBody.password, User?.password);
  }
  if (match) {
    const token = sign({ id: User.id }, configEnv.jwtTokenSecret as string, {
      expiresIn: config.tokenLife,
    });
    const refreshT = sign(
      { id: User.id },
      configEnv.jwtRefreshTokenSecret as string,
      {
        expiresIn: config.refreshTokenLife,
      }
    );
    refreshTokens.push(refreshT);

    return {
      message: "login sucess",
      token: token,
      refreshToken: refreshT,
      status: 200,
      id: User?.id,
      expires: new Date(config.tokenLife).getTime().toString(),
    };
  } else {
    throw new Validation(400, "not matching password", "password");
  }
};
export const resendConfirmNumberService = async (reqBody: any) => {
  const { user_id } = reqBody;
  const user = await userModel.findById(user_id);
  if (!user) throw new NotFound(404, "User not found");
  await user_confirm_number.deleteMany({ user_id });
  const num = Math.floor(Math.random() * 900000) + 100000;
  await user_confirm_number.create({
    user_id,
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
  const data: dataType = await new Promise((resolve, reject) => {
    worker.on("message", resolve);
    worker.on("error", reject);
  });

  if (data.success) {
    return {
      message: "Thư xác nhận đã được chuyển đến mail của bạn",
      status: 201,
      id: user_id,
      social: reqBody.isSocialConnect ? true : false,
    };
  } else {
    throw new HttpError(500, "Cannot send email");
  }
};

export const checkRegistrationService = async (reqBody: any) => {
  const { user_id, numberConfirm } = reqBody;
  const numberConfirmUser = await user_confirm_number.findOne({ user_id });
  if (!numberConfirmUser) throw new NotFound(404, "Cannot found number");
  else if (numberConfirmUser.numberConfirm === numberConfirm) {
    const user = await userModel.findById(user_id);
    if (!user) throw new NotFound(404, "Cannot found user");
    user.isVerified = true;
    await Promise.all([
      user.save(),
      user_confirm_number.findByIdAndDelete(numberConfirmUser._id),
    ]);
    return { message: "Confirm success", status: 200 };
  }
  return { message: "Confirm failed", status: 400 };
};

export const forgotPasswordService = async (reqBody: any) => {
  const user = await userModel.findOne({ username: reqBody.username });
  if (!user) throw new NotFound(404, "User not found");
  if (user.email !== reqBody.email)
    throw new Validation(401, "Email not matching", "email");
  await user_token.deleteOne({ user_id: user._id });
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(configEnv.saltRound));
  await user_token.create({
    user_id: user._id,
    token: hash,
    createdAt: new Date(),
  });
  const link = `${configEnv.urlClient}/authen/changepassword?token=${resetToken}&id=${user._id}`;
  worker.postMessage({
    email: user.email,
    subject: "Reset Password",
    templateData: {
      name: user.username,
      link,
      "support-email": "shopmaikusobu@gmail.com",
      "site-name": "ShopMaikusobu",
    },
    templateName: "requestResetPassword",
  });
  const data: dataType = await new Promise((resolve, reject) => {
    worker.on("message", resolve);
    worker.on("error", reject);
  });

  if (data.success) {
    return {
      status: 200,
      message: "Email sent successfully",
      link,
    };
  } else {
    throw new HttpError(500, "Cannot send email");
  }
};
export const changePasswordService = async (reqBody: any) => {
  const { user_id, token, password } = reqBody;
  const passwordResetToken = await user_token.findOne({ user_id });
  if (!passwordResetToken) throw new NotFound(404, "Token not found");
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) throw new Unauthorized(401, "Token not valid");
  const salt = await bcrypt.genSalt(Number(configEnv.saltRound));
  const hash = await bcrypt.hash(password, salt);
  await userModel.findByIdAndUpdate(user_id, {
    $set: { password: hash },
  });
  await user_token.deleteOne({ user_id });

  return { message: "Password changed successfully", status: 200 };
};

export const refreshTokenService = async (reqBody: any) => {
  const { refreshToken } = reqBody;
  return new Promise((resolve, reject) => {
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
      reject(new NotFound(404, "Not found refresh token"));
    } else {
      verify(
        refreshToken,
        configEnv.jwtRefreshTokenSecret as string,
        ((err: any, decode: { id: string }) => {
          if (err) {
            reject(new Unauthorized(401, "In valid refresh token"));
          } else {
            const access_token = sign(
              { id: decode.id },
              configEnv.jwtTokenSecret as string,
              {
                expiresIn: config.tokenLife,
              }
            );
            resolve({ refreshToken, access_token, status: 200 });
          }
        }) as VerifyOptions
      );
    }
  });
};

export const logoutService = async (reqBody: any) => {
  const { refreshToken } = reqBody;
  if (!refreshToken) throw new NotFound(404, "Not found refresh token");
  const index = refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }
  return { message: "Logout successfully", status: 200 };
};
