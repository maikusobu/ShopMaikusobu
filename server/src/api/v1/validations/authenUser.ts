import { verify } from "jsonwebtoken";
import type { User } from "../../../types/userType";
export const authenticateToken = (token: string, secret: string) => {
  const verified = verify(token);
  return verified as User;
};
