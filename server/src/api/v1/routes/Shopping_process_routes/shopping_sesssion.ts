import express from "express";
const Router = express.Router();
import {
  getShoppingSession,
  updateDelete,
  updateCartItem,
  deleteALlCartItem,
} from "../../controllers/Shopping_process_controller/ShoppingController";
Router.get("/:id", getShoppingSession);
Router.patch("/update-delete/:id", updateDelete);
Router.patch("/update-cart-item/:id", updateCartItem);
Router.patch("/update-delete-all-cart-items/:id", deleteALlCartItem);
export default Router;
