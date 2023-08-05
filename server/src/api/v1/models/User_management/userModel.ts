import mongoose, { ValidatorProps, InferSchemaType } from "mongoose";
import { faker } from "@faker-js/faker";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
      validate: [
        {
          validator: function (v: string) {
            return v.length >= 1;
          },
          message: (props: ValidatorProps) =>
            `${props.value} does not match the requirement length.`,
        },

        {
          validator: function (v: string) {
            return /^[a-zA-Z0-9]+$/i.test(v);
          },
          message: (props: ValidatorProps) =>
            `${props.value} is not a valid username.`,
        },
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid email.`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: [
        {
          validator: function (v: string) {
            return v.length >= 6;
          },
          message: (props: ValidatorProps) =>
            `${props.value} does not match the requirement length.`,
        },
        {
          validator: function (v: string) {
            return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/.test(
              v
            );
          },
          message: (props: ValidatorProps) =>
            `${props.value} is not a strong password.`,
        },
      ],
    },
    idDefaultAddress: {
      type: Schema.Types.ObjectId,
      default: faker.database.mongodbObjectId(),
      ref: "UserAddress",
    },
    idDefaultPayment: {
      type: Schema.Types.ObjectId,
      default: faker.database.mongodbObjectId(),
      ref: "UserPayment",
    },
    avatar: {
      type: Buffer,
      default: null,
    },
    picture: {
      default: "",
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSocialConnect: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
type UserModel = InferSchemaType<typeof userSchema>;
userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 24 * 60 * 60,
    partialFilterExpression: { isVerified: false },
  }
);
export default mongoose.model<UserModel>("User", userSchema);
