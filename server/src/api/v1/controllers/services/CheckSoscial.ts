import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
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
      let userInfo;
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
        userInfo = await fetch(
          `https://graph.facebook.com/me?fields=id,name,emai,picturel&access_token=${req.body.accessToken}`
        );
      }

      let data = (await userInfo!.json()) as any;
      if (req.query.facebook) {
        data = {
          ...data,
          picture: data.picture.data.url,
        };
      }
      const user = await userModel.findOne({ email: data.email });
      if (user) {
        if (user.isSocialConnect) {
          req.body.username = user.username;
          req.body.isSocialLogin = true;
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
