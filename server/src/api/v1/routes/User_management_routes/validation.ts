import express from "express";
import {
  signupMiddeware,
  signinMiddeware,
  forgotPasswordMiddeware,
  changePasswordMiddeware,
  refreshToken,
  logout,
} from "../../controllers/services/validationController";
import { middlwareSocialLogin } from "../../controllers/services/CheckSoscial";
import { CheckRegisteration } from "../../controllers/services/CheckRegisteration";
const router = express.Router();
router.post("/login", middlwareSocialLogin, signinMiddeware);
router.post("/refreshToken", refreshToken);
router.post("/verify", CheckRegisteration);
router.post("/logout", logout);
router.post("/signup", signupMiddeware);
router.post("/forgotpassword", forgotPasswordMiddeware);
router.patch("/changepassword", changePasswordMiddeware);
export default router;
