export function generatedAvatar(userName: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, Math.PI * 2);
    const circleColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    ctx.fillStyle = circleColor;
    ctx.fill();
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textColor = getContrastColor(circleColor);
    ctx.fillStyle = textColor;
    ctx.fillText(userName.charAt(0).toUpperCase(), 50, 50);
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    });
  });
}
function getContrastColor(hexcolor: string) {
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}
