import express from "express";
import { userMiddleware } from "../../controllers/User_management_controller/userController";
const router = express.Router();
router.get("/:id", userMiddleware);
export default router;
