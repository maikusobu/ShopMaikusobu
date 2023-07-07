import { ObjectId } from "bson";
export type UserAddressModel = {
  user_id: ObjectId;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country?: string;
};
