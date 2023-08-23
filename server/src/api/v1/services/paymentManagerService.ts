import user_manager_paymentModel from "../models/User_management/user_manager_paymentModel";
import user_paymentModel from "../models/User_management/user_paymentModel";
import { NotFound } from "../interfaces/ErrorInstances";

export const getUserPayments = async (id: string) => {
  if (!id) throw new NotFound(404, "Payment_id not found");
  return await user_manager_paymentModel
    .findOne({
      user_id: id,
    })
    .populate({
      path: "payment_list",
      model: user_paymentModel,
    });
};

export const updateDeletePayment = async (id: string, payment_id: string) => {
  if (!payment_id) throw new NotFound(404, "Payment_id not found");
  if (!id) throw new NotFound(404, "User_id not found");
  const userPayment = await user_manager_paymentModel
    .findOneAndUpdate(
      { user_id: id },
      {
        $pull: {
          payment_list: payment_id,
        },
      },
      {
        new: true,
      }
    )
    .populate({
      path: "payment_list",
      model: user_paymentModel,
    });
  await user_paymentModel.findByIdAndDelete(payment_id);
  return userPayment;
};

export const updateInsertPayment = async (id: string, payment_id: string) => {
  if (!payment_id) throw new NotFound(404, "Payment_id not found");
  if (!id) throw new NotFound(404, "User_id not found");
  return await user_manager_paymentModel
    .findOneAndUpdate(
      { user_id: id },
      {
        $addToSet: {
          payment_list: payment_id,
        },
      },
      {
        new: true,
      }
    )
    .populate({
      path: "payment_list",
      model: user_paymentModel,
    });
};
