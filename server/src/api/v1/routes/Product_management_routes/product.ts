import express from "express";
import {
  productGetAllMiddleware,
  productGetByIdMiddleware,
  productGetTrendingMiddleware,
  productSearch,
} from "../../controllers/Product_management_controller/productController";
const router = express.Router();
router.get("/", productGetAllMiddleware);
router.get("/search", productSearch);
router.get("/trending", productGetTrendingMiddleware);
router.get("/:id", productGetByIdMiddleware);

export default router;
