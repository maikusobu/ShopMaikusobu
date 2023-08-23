import cart_itemModel from "../models/Shopping_process/cart_itemModel";
import { NotFound } from "../interfaces/ErrorInstances";

interface CartItemData {
  product_id: string;
  quantity: number;
}

export const getCartItemByProductId = async (product_id: string) => {
  const cartItem = await cart_itemModel.findOne({ product_id }).lean();
  if (!cartItem) {
    throw new NotFound(404, "Cart item not found");
  }
  return cartItem;
};

export const createCartItem = async (data: CartItemData) => {
  const { product_id, quantity } = data;
  let cartItem;
  const cartItemFound = await cart_itemModel.findOne({ product_id }).lean();
  if (cartItemFound) {
    cartItem = await cart_itemModel.findOneAndUpdate(
      { product_id },
      { quantity: quantity + (cartItemFound.quantity as number) },
      {
        new: true,
      }
    );
  } else cartItem = await cart_itemModel.create({ product_id, quantity });
  return cartItem;
};

export const updateCartItem = async (data: CartItemData) => {
  const { product_id, quantity } = data;
  const cartItem = await cart_itemModel.findOneAndUpdate(
    { product_id },
    { quantity },
    { new: true, runValidators: true }
  );
  if (!cartItem) {
    throw new NotFound(404, "Cart item not found");
  }
  return cartItem;
};

export const deleteCartItem = async (product_id: string) => {
  const cartItem = await cart_itemModel.findOneAndDelete({ product_id });
  if (!cartItem) {
    throw new NotFound(404, "Cart item not found");
  }
  return cartItem;
};
