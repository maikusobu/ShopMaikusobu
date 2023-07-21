import express from "express";
const Router = express.Router();
import {
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from "../../controllers/User_management_controller/user_addressController";
Router.post("/create", createUserAddress);
Router.patch("/delete/:payment_id", deleteUserAddress);
Router.patch("/update/:payment_id", updateUserAddress);

export default Router;
