export function saveDataURLToBinaryData(dataURL: string) {
  const base64Data = dataURL.split(",")[1]; // convert từ dataUrl sang dạng base64
  if (typeof base64Data === "undefined") {
    throw new Error("Invalid data URL");
  }
  const buffer = Buffer.from(base64Data, "base64"); // convert base64 sang buffer
  return buffer; // trả về 1 một buffer data
  // if (!fs.existsSync(dirPath)) {
  //   fs.mkdirSync(dirPath);
  // }
  // const filePath = path.join(dirPath, `${userName}.png`);
  // fs.writeFileSync(filePath, buffer);
}
