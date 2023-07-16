import express from "express";
import {
  getUserPayment,
  upsertUserPayment,
} from "../../controllers/User_management_controller/user_paymentControll";
const Router = express.Router();
Router.get("/:id", getUserPayment);
Router.patch("/:id", upsertUserPayment);

export default Router;
