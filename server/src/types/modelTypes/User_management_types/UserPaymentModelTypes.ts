import { ObjectId } from "bson";
export type UserPaymentModel = {
  user_id: ObjectId;
  payment_mode: "credit" | "debit" | "paypal" | "bank";
  card_number: number;
  expire: Date;
};
