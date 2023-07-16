import express from "express";
const Router = express.Router();
import {
  getShoppingSession,
  updateShoppingSession,
  updateCartItem,
} from "../../controllers/Shopping_process_controller/ShoppingController";
Router.get("/:id", getShoppingSession);
Router.patch("/update-delete/:id", updateShoppingSession);
Router.patch("/update-cart-item/:id", updateCartItem);
export default Router;
