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
      const ticket = await oAuth2Client.getToken(req.body.code);

      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${ticket.tokens.access_token}`,
          },
        }
      );
      const data = await userInfo.json();
      const user = await userModel.findOne({ email: data.email });
      if (user) {
        req.body.username = user.username;
        req.body.isSocialLogin = true;
        return next();
      } else {
        res.json({
          isExisted: false,
          user: data,
        });
      }
    } else return next();
  }
);
