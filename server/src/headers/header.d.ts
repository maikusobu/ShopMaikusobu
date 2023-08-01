import session from "express-session";

declare module "express-session" {
  export interface SessionData {
    token: { [key: string]: any };
  }
}
