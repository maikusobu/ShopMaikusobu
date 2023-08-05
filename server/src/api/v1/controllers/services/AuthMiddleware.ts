import { Response, Request, NextFunction } from "express";
import { verify, VerifyOptions } from "jsonwebtoken";
import { unless } from "express-unless";

interface DecodedToken {
  id: string;
}
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return next(); // by pass rule preflight for cross site request
  const token = req.cookies["token"];
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
      status: 401,
    });
  } else
    verify(
      token,
      process.env.JWT_TOKEN_SECRET as string,
      ((err: any, decoded: DecodedToken) => {
        if (err)
          return res.status(401).json({
            message: "Invalid Token",
          });
        else {
          req.body.userId = decoded.id;
          return next();
        }
      }) as VerifyOptions
    );
};
authMiddleware.unless = unless;

export default authMiddleware;
