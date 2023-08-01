import express from "express";
import {
  userMiddleware,
  userUpdateMiddleware,
} from "../../controllers/User_management_controller/userController";

const router = express.Router();
router.get("/:id", userMiddleware);
router.patch("/update/:id", userUpdateMiddleware);
export default router;
