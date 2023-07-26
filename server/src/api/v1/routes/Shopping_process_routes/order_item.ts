import express from "express";
import {
  OrderCreate,
  OrderDelete,
  OrderList,
} from "../../controllers/Shopping_process_controller/OrderController";
const Router = express.Router();
Router.get("/:user_id", OrderList);
Router.post("/create", OrderCreate);
Router.delete("/delete/:id", OrderDelete);
export default Router;

//  * @swagger
