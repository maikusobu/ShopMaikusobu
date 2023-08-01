import { Response, Request, NextFunction } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";
import { unless } from "express-unless";

interface DecodedToken {
  id: string;
}
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["token"];
  console.log(req.cookies);
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
      status: 401,
    });
  } else
    verify(
      token,
      process.env.JWT_TOKEN_SECRET,
      (err: any, decoded: DecodedToken) => {
        if (err)
          return res.status(401).json({
            message: "Invalid Token",
          });
        else {
          req.body.userId = decoded.id;
          return next();
        }
      }
    );
};
authMiddleware.unless = unless;

export default authMiddleware;
