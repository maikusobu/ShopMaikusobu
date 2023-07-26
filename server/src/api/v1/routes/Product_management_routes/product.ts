import express from "express";
import {
  productGetAllMiddleware,
  productGetByIdMiddleware,
  productGetTrendingMiddleware,
  productSearch,
} from "../../controllers/Product_management_controller/productController";
const router = express.Router();
router.get("/", productGetAllMiddleware);
router.get("/trending", productGetTrendingMiddleware);
router.get("/:id", productGetByIdMiddleware);
router.get("/search/:name", productSearch);
export default router;
