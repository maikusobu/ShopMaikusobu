import express from "express";
const Router = express.Router();
import {
  createUserPayment,
  updateUserPayment,
  deleteUserPayment,
} from "../../controllers/User_management_controller/user_paymentControll";

Router.post("/create", createUserPayment);
Router.patch("/delete/:payment_id", deleteUserPayment);
Router.patch("/update/:payment_id", updateUserPayment);

export default Router;
