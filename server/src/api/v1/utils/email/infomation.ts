/* eslint-disable @typescript-eslint/no-explicit-any */
import { configEnv } from "../../../../config/configEnv";
export const info = (...params: any[]) => {
  if (configEnv.mode !== "TEST") {
    console.log(...params);
  }
};
export const error = (...params: any[]) => {
  if (configEnv.mode !== "TEST") {
    console.error(...params);
  }
};
