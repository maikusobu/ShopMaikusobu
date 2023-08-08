import express from "express";
import {
  productGetAllMiddleware,
  productGetByIdMiddleware,
  productGetTrendingMiddleware,
  productSearch,
} from "../../controllers/Product_management_controller/productController";

import { getReviewRating } from "../../controllers/User_management_controller/user_reviewController";

const router = express.Router();
router.get("/", productGetAllMiddleware);
router.get("/search", productSearch);
router.get("/trending", productGetTrendingMiddleware);
router.get("/:id", productGetByIdMiddleware);
router.get("/review/:product_id", getReviewRating);
export default router;
