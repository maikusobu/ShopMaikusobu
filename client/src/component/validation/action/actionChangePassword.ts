import { actionGenerator } from "./actionGenerator";
const urlRequest = "authen/changepassword";
const urlRedirect = "authen/login";
const action = actionGenerator(urlRequest, urlRedirect, "PUT");
export default action;
