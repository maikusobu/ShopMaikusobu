import express from "express";
import {
  signupMiddleware,
  signinMiddleware,
  forgotPasswordMiddleware,
  changePasswordMiddleware,
  refreshTokenMiddleware,
  logoutMiddleware,
  checkRegistrationMiddleware,
  resendConfirmNumberMiddleware,
} from "../../controllers/Auth_validation_controller/validationController";
import { middlwareSocialLogin } from "../../middlewares/CheckSoscial";
const router = express.Router();
router.post("/login", middlwareSocialLogin, signinMiddleware);
router.post("/refreshToken", refreshTokenMiddleware);
router.post("/resend", resendConfirmNumberMiddleware);
router.post("/verify", checkRegistrationMiddleware);
router.post("/logout", logoutMiddleware);
router.post("/signup", signupMiddleware);
router.post("/forgotpassword", forgotPasswordMiddleware);
router.patch("/changepassword", changePasswordMiddleware);
export default router;
