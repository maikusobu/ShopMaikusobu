import { Response, Request, NextFunction } from "express";
import { verify, VerifyOptions } from "jsonwebtoken";
import { unless } from "express-unless";
import { Unauthorized } from "../../interfaces/ErrorInstances";
interface DecodedToken {
  id: string;
}
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return next(); // by pass rule preflight for cross site request
  const token = req.cookies["token"];
  if (!token) {
    next(new Unauthorized(401, "Not found token"));
  } else
    verify(
      token,
      process.env.JWT_TOKEN_SECRET as string,
      ((err: any, decoded: DecodedToken) => {
        if (err) return next(new Unauthorized(401, "Invalid token"));
        else {
          req.body.userId = decoded.id;
          return next();
        }
      }) as VerifyOptions
    );
};
authMiddleware.unless = unless;

export default authMiddleware;
