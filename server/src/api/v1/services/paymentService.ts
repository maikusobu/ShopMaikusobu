import user_paymentModel from "../models/User_management/user_paymentModel";
import { NotFound } from "../interfaces/ErrorInstances";

interface PaymentData {
  user_id: string;
  payment_type: string;
  card_number: string;
  expire: string;
}

export const createUserPayment = async (data: PaymentData) => {
  const { user_id, payment_type, card_number, expire } = data;
  if (!user_id || !payment_type || !card_number || !expire) {
    throw new NotFound(404, "Missing some of requirements to create payment");
  }
  const expireDate = new Date(expire);
  const userPayment = new user_paymentModel({
    user_id,
    payment_type,
    card_number,
    expire: expireDate,
  });
  await userPayment.save();
  return userPayment;
};

export const updateUserPayment = async (
  payment_id: string,
  data: PaymentData
) => {
  if (!payment_id) {
    throw new NotFound(400, "Missing payment_id");
  }
  const { user_id, payment_type, card_number, expire } = data;

  const expireDate = new Date(expire);
  const userPayment = await user_paymentModel.findByIdAndUpdate(
    payment_id,
    {
      user_id,
      payment_type,
      card_number,
      expire: expireDate,
    },
    { new: true }
  );

  if (!userPayment) {
    throw new NotFound(404, "User payment not found");
  }
  return userPayment;
};
export const deleteUserPayment = async (payment_id: string) => {
  const userPayment = await user_paymentModel.findByIdAndDelete(payment_id);

  if (!userPayment) {
    throw new NotFound(404, "User payment not found");
  }

  return userPayment;
};
