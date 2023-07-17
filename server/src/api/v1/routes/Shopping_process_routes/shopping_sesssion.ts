import express from "express";
const Router = express.Router();
import {
  getShoppingSession,
  updateDelete,
  updateCartItem,
} from "../../controllers/Shopping_process_controller/ShoppingController";
Router.get("/:id", getShoppingSession);
Router.patch("/update-delete/:id", updateDelete);
Router.patch("/update-cart-item/:id", updateCartItem);
export default Router;
