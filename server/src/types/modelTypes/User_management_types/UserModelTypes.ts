import { ObjectId } from "bson";
export type UserModel = {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
};
