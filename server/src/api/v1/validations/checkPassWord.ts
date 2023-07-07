const bcrypt = require("bcrypt");
export default async function checkUser(
  password: string,
  userPassWord: string
) {
  const result = await bcrypt.compare(password, userPassWord);
  return result;
}
