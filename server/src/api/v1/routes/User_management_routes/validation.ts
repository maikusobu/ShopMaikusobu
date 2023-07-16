import express from "express";
import {
  signupMiddeware,
  signinMiddeware,
  forgotPasswordMiddeware,
  changePasswordMiddeware,
} from "../../controllers/User_management_controller/validationController";

const router = express.Router();
router.post("/login", signinMiddeware);
router.post("/signup", signupMiddeware);
router.post("/forgotpassword", forgotPasswordMiddeware);
router.patch("/changepassword", changePasswordMiddeware);
export default router;
