import mongoose, {
  ValidatorProps,
  InferSchemaType,
  SchemaType,
} from "mongoose";

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
            return /^[a-zA-Z]+$/i.test(v);
          },
          message: (props: ValidatorProps) =>
            `${props.value} is not a valid username.`,
        },
      ],
    },
    email: {
      type: String,
      required: [true, "User email required"],
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
      unique: true,
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
      default: new mongoose.Types.ObjectId("507f191e810c19729de860ea"),
      ref: "UserAddress",
    },
    idDefaultPayment: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId("507f191e810c19729de860ea"),
      refL: "UserPayment",
    },
    avatar: {
      type: Buffer,

      default: null,
    },
    picture: {
      default: "",
      type: String,
    },
  },
  { timestamps: true }
);
type UserModel = InferSchemaType<typeof userSchema>;
userSchema.virtual("fullname").get(function (this: UserModel) {
  return this.first_name + " " + this.last_name;
});

export default mongoose.model<UserModel>("User", userSchema);
