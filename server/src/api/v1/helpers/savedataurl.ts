import * as fs from "fs";
import * as path from "path";
import { dirPath } from "./returnUrl";
export function saveDataURLToFile(dataURL: string, userName: string) {
  const base64Data = dataURL.split(",")[1];
  if (typeof base64Data === "undefined") {
    throw new Error("Invalid data URL");
  }
  const buffer = Buffer.from(base64Data, "base64");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  const filePath = path.join(dirPath, `${userName}.png`);
  fs.writeFileSync(filePath, buffer);
}
