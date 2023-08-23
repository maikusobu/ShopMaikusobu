import mongoose, { InferSchemaType } from "mongoose";
import { ValidatorProps } from "mongoose";
const Schema = mongoose.Schema;
const UserPayment = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  payment_type: {
    type: String,
    required: true,
    enum: ["credit", "debit", "paypal", "bank"],
    validate: {
      validator: function (v: string) {
        return ["credit", "debit", "paypal", "bank"].includes(v);
      },
      message: (props: ValidatorProps) =>
        `${props.value} is not a valid payment type!`,
    },
  },
  card_number: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function (v: number) {
        let nCheck = 0;
        let bEven = false;
        const sNum = v.toString();
        for (let n = sNum.length - 1; n >= 0; n--) {
          const cDigit = sNum.charAt(n);
          let nDigit = parseInt(cDigit, 10);
          if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
          nCheck += nDigit;
          bEven = !bEven;
        }
        return nCheck % 10 == 0;
      },
      message: (props: ValidatorProps) =>
        `${props.value} is not a valid card number.`,
    },
  },

  expire: { type: Date, required: true },
});
export default mongoose.model<InferSchemaType<typeof UserPayment>>(
  "UserPayment",
  UserPayment
);
