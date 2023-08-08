import express from "express";
import {
  userMiddleware,
  userUpdateMiddleware,
} from "../../controllers/User_management_controller/userController";
import { updateUserReaction } from "../../controllers/User_management_controller/user_reviewController";
const router = express.Router();
router.get("/:id", userMiddleware);
router.patch("/update/:id", userUpdateMiddleware);
router.patch("/update-reaction", updateUserReaction);
export default router;
