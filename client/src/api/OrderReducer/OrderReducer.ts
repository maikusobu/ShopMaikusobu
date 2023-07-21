import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
interface initialStateType {
  totalPrice: number;
  totalQuantity: number;
}
const initialState: initialStateType = {
  totalPrice: 0,
  totalQuantity: 0,
};
const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    InsertOrder(state, action: PayloadAction<initialStateType>) {
      state.totalPrice = action.payload.totalPrice;
      state.totalQuantity = action.payload.totalQuantity;
    },
  },
});
export const { InsertOrder } = OrderSlice.actions;
export default OrderSlice.reducer;
export const selectOrder = (state: RootState) => state.order;
