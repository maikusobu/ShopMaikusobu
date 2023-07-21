import express from "express";
const Router = express.Router();
import {
  getUserAddresses,
  updateDeleteAddress,
  updateInsertAddress,
} from "../../controllers/User_management_controller/user_manageaddressController";
Router.get("/:id", getUserAddresses);
Router.patch("/update-delete/:id", updateDeleteAddress);
Router.patch("/update-insert/:id", updateInsertAddress);

export default Router;
