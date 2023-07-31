export function saveDataURLToBinaryData(dataURL: string) {
  const base64Data = dataURL.split(",")[1];
  if (typeof base64Data === "undefined") {
    throw new Error("Invalid data URL");
  }

  const buffer = Buffer.from(base64Data, "base64");
  console.log(buffer);
  return buffer;
  // if (!fs.existsSync(dirPath)) {
  //   fs.mkdirSync(dirPath);
  // }
  // const filePath = path.join(dirPath, `${userName}.png`);
  // fs.writeFileSync(filePath, buffer);
}
