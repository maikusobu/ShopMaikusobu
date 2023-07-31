import express from "express";
import {
  signupMiddeware,
  signinMiddeware,
  forgotPasswordMiddeware,
  changePasswordMiddeware,
} from "../../controllers/services/validationController";
import { middlwareSocialLogin } from "../../controllers/services/CheckSoscial";
const router = express.Router();
router.post("/login", middlwareSocialLogin, signinMiddeware);
router.post("/signup", signupMiddeware);
router.post("/forgotpassword", forgotPasswordMiddeware);
router.patch("/changepassword", changePasswordMiddeware);
export default router;
