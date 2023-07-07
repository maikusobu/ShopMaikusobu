import { verify } from "jsonwebtoken";
import type { User } from "../../../types/userType";
export const authenticateToken = (token: string) => {
  const verified = verify(token, process.env.JWT_SECRET as string);
  return verified as User;
};
