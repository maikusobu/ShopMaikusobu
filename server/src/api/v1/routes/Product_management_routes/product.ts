import express from "express";
import {
  productGetAllMiddleware,
  productGetByIdMiddleware,
  productGetTrendingMiddleware,
} from "../../controllers/Product_manage_controller/productController";
const router = express.Router();
router.get("/all", productGetAllMiddleware);
router.get("/trending", productGetTrendingMiddleware); // move this line up
router.get("/:id", productGetByIdMiddleware); // move this line down
export default router;
