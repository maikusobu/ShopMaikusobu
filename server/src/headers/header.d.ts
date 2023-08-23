/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "express-session" {
  export interface SessionData {
    token: { [key: string]: any };
  }
}
