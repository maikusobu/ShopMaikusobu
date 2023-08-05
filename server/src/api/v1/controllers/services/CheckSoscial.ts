import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import userModel from "../../models/User_management/userModel";
require("dotenv").config();
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);
import expressAsyncHandler from "express-async-handler";

export const middlwareSocialLogin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.isSocialLogin) {
      let userInfo; // kiểm tra xem request này có phải đến từ social hay không
      if (req.query.google) {
        const ticket = await oAuth2Client.getToken(req.body.code);
        userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${ticket.tokens.access_token}`,
            },
          }
        );
      } else if (req.query.facebook) {
        // kiểm tra khi mà đến từ facebook
        // nếu đoạn code facebook yêu cầu phải lấy access_token từ phía server thì có thể viết tương tự như google
        userInfo = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email&access_token=${req.body.accessToken}`
        ); // đoạn code mẫu nếu access token lấy được từ client
      }
      const data = await userInfo!.json();
      const user = await userModel.findOne({ email: data.email }); // kiểm tra xem có tồn tại email không
      if (user) {
        if (user.isSocialConnect) {
          // kiểm tra xem mail đã được đăng ký với tài khoảng thường hay với liên kết social
          req.body.username = user.username;
          req.body.isSocialLogin = true; // bypass checking password
          return next();
        } else {
          res.json({
            isExisted: true,
            user: data,
            isSocialConnect: false,
          });
        }
      } else {
        res.json({
          isExisted: false,
          user: data,
          isSocialLogin: true,
        });
      }
    } else return next();
  }
);
