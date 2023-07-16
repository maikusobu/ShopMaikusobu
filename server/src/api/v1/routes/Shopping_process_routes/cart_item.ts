import express from "express";
const Router = express.Router();
import {
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItemByProductId,
} from "../../controllers/Shopping_process_controller/CartItemController";
Router.get("/:product_id", getCartItemByProductId);
Router.put("/create", createCartItem);
Router.delete("/delete", updateCartItem);
Router.patch("/update", deleteCartItem);
export default Router;
