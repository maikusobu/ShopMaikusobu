import * as fs from "fs";
import path from "path";
import { dirPath } from "./returnUrl";
export async function blobTofile(blob: Blob, userName: string): Promise<void> {
  const buffer = await blob.arrayBuffer();
  const filePath = path.join(dirPath, `${userName}.png`);
  fs.writeFileSync(filePath, buffer as Buffer);
}
