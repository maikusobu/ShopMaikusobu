import order_items from "../models/Shopping_process/order_items";
import order_detailsModel from "../models/Shopping_process/order_detailsModel";

interface OrderData {
  user_id: string;
  totalPrice: number;
  totalQuantity: number;
  address_id: string;
  OrderItems: string[];
  payment_id: string;
}

export const OrderCreate = async (data: OrderData) => {
  const arrayhandleOrderitem = data.OrderItems.map(
    async (OrderItem) => await order_items.create(OrderItem)
  );
  const OrderItems = await Promise.all(arrayhandleOrderitem);
  return await order_detailsModel.create({
    user_id: data.user_id,
    totalPrice: data.totalPrice,
    totalQuantity: data.totalQuantity,
    address_id: data.address_id,
    OrderItems,
    payment_id: data.payment_id,
  });
};

export const OrderList = async (user_id: string) => {
  return await order_detailsModel.find({
    user_id,
  });
};

export const OrderDelete = async (id: string) => {
  return await order_detailsModel.findByIdAndDelete(id);
};
