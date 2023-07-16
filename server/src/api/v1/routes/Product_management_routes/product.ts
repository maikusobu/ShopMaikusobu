import express from "express";
import {
  productGetAllMiddleware,
  productGetByIdMiddleware,
  productGetTrendingMiddleware,
} from "../../controllers/Product_management_controller/productController";
const router = express.Router();
router.get("/all", productGetAllMiddleware);
router.get("/trending", productGetTrendingMiddleware);
router.get("/:id", productGetByIdMiddleware);
export default router;
