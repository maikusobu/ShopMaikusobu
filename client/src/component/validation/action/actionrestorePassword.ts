import { actionGenerator } from "./actionGenerator";
const urlRequest = "authen/forgotpassword";
const urlRedirect = "authen/changepassword";
const action = actionGenerator(urlRequest, urlRedirect, "POST");
export default action;
