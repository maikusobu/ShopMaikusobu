require("dotenv").config();
const urlClient = process.env.URL_CLIENT;
const port = process.env.PORT;
const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
const jwtRefreshTokenSecret = process.env.JWT_REFRESHTOKEN_SECRET;
const saltRound = process.env.SALT_ROUND;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const mode = process.env.MODE;
const mongoUrl =
  mode === "TEST" ? process.env.MONGO_TEST : process.env.MONGO_URL;
const gmailPassword = process.env.GMAIL_PASSWORD;
const gmailAccount = process.env.GMAIL_ACCOUNT;
export const configEnv = {
  urlClient,
  port,
  jwtTokenSecret,
  jwtRefreshTokenSecret,
  mongoUrl,
  saltRound,
  clientId,
  clientSecret,
  mode,
  gmailPassword,
  gmailAccount,
};
