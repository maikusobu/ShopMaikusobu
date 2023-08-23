import shopping_session from "../models/Shopping_process/shopping_session";
import cart_itemModel from "../models/Shopping_process/cart_itemModel";
import { NotFound } from "../interfaces/ErrorInstances";

export const getShoppingSession = async (id: string) => {
  const shopping_session_data = await shopping_session
    .findOne({
      user_id: id,
    })
    .lean()
    .populate({
      path: "cart_items",
      populate: {
        path: "product_id",
        populate: [
          {
            path: "discount_id",
          },
          {
            path: "inventory_id",
          },
        ],
      },
    });

  if (!shopping_session_data) {
    throw new NotFound(404, "Shopping session not found");
  }
  return shopping_session_data;
};

export const updateDelete = async (id: string, CartItemId: string) => {
  return await shopping_session.findOneAndUpdate(
    { user_id: id },
    {
      $pull: {
        cart_items: CartItemId,
      },
    },
    {
      new: true,
    }
  );
};

export const updateCartItem = async (id: string, CartItemId: string) => {
  return await shopping_session.findOneAndUpdate(
    { user_id: id },
    {
      $addToSet: {
        cart_items: CartItemId,
      },
    },
    {
      new: true,
    }
  );
};

export const deleteALlCartItem = async (id: string) => {
  const shopping_session_data = await shopping_session
    .findOne({
      user_id: id,
    })
    .lean();
  const arrayHandleDelete = shopping_session_data?.cart_items.map(
    async (item) => await cart_itemModel.findByIdAndDelete(item)
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await Promise.all(arrayHandleDelete as any);

  return await shopping_session.findOneAndUpdate(
    { user_id: id },
    {
      $set: {
        cart_items: [],
      },
    },
    { new: true }
  );
};
