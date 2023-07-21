import express from "express";
import {
  getUserPayments,
  updateInsertPayment,
  updateDeletePayment,
} from "../../controllers/User_management_controller/user_managepaymentControll";
const Router = express.Router();
Router.get("/:id", getUserPayments);
Router.patch("/update-insert/:id", updateInsertPayment);
Router.patch("/update-delete/:id", updateDeletePayment);
export default Router;
