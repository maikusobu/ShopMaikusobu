import express from "express";
import {
  signupMiddeware,
  signinMiddeware,
  forgotPasswordMiddeware,
  changePasswordMiddeware,
} from "../../controllers/User_management_controller/validationController";

const router = express.Router();
// interface ValidationError extends Error {
//   errors: {
//     [key: string]: {
//       message: string;
//       name: string;
//       properties: {
//         message: string;
//         type: string;
//         path: string;
//         value: any;
//       };
//       kind: string;
//       path: string;
//       value: any;
//     };
//   };
// }

router.post("/login", signinMiddeware);
router.post("/signup", signupMiddeware);
router.post("/forgotpassword", forgotPasswordMiddeware);
router.put("/changepassword", changePasswordMiddeware);
export default router;
