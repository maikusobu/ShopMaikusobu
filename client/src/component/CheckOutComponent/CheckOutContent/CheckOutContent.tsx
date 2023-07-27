import { useGetUserByIdQuery } from "../../../api/UserApi/UserApi";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useGetShoppingSessionQuery } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { MathFunction } from "../../../Helper/MathFunction";
import { selectOrder } from "../../../api/OrderReducer/OrderReducer";
import { useCreateOrderMutation } from "../../../api/OrderApi/OrderApi";
import { OrderItem } from "../../../api/OrderApi/OrderApi";
import { notifications } from "@mantine/notifications";
import { useUpdateDeleteAllCartItemMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { useNavigate } from "react-router-dom";
function CheckOutContent() {
  const auth = useAppSelector(selectAuth);
  const order = useAppSelector(selectOrder);
  const { data: user } = useGetUserByIdQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const { data } = useGetShoppingSessionQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const navigate = useNavigate();
  const [updateDeleteAllCartItem] = useUpdateDeleteAllCartItemMutation();
  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();
  const handlerSend = () => {
    const orderItems = data?.cart_items.map((item) => ({
      product_id: item.product_id._id,
      quantity: item.quantity,
    }));
    const OrderDetails = {
      user_id: user?.id ? user?.id : "",
      totalPrice: order?.totalPrice,
      totalQuantity: order.totalQuantity,
      address_id: user?.idDefaultAddress as string,
      OrderItems: orderItems as OrderItem[],
      payment_id: user?.idDefaultPayment as string,
    };
    // eslint-disable-next-line no-debugger

    createOrder(OrderDetails)
      .unwrap()
      .then(() => {
        updateDeleteAllCartItem(auth.id);

        notifications.show({
          id: "success",
          title: "Đặt hàng thành công",
          message:
            "Cảm ơn bạn đã đặt bạn giờ đây bạn sẽ được điều hướng về trang chủ",
          autoClose: 1000,
          loading: true,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch(() => {
        notifications.show({
          id: "errror",
          title: "Đặt hàng không thành công",
          message: "vui lòng thử lại",
          autoClose: 5000,
          loading: true,
        });
      });
  };
  return (
    <Container>
      <LoadingOverlay visible={orderLoading} />
      <Group>
        {user?.idDefaultAddress === import.meta.env.VITE_DEFAULT && (
          <Text>Bạn chưa chọn địa chỉ mặc định</Text>
        )}
        {user?.idDefaultAddress !== import.meta.env.VITE_DEFAULT && (
          <Text>Địa chỉ của bạn là {user?.idDefaultAddress}</Text>
        )}
      </Group>
      <Stack>
        {data?.cart_items.map((item) => (
          <div>
            <Group>
              <Text>{item.product_id.name}</Text>
              {item.product_id.discount_id?.active && (
                <Text>
                  {"$"}
                  {(
                    MathFunction(
                      item.product_id.price,
                      item.product_id.discount_id.discount_percent
                    ) * item.quantity
                  ).toFixed(2)}
                </Text>
              )}
              {!item.product_id.discount_id?.active && (
                <Text>
                  ${(item.product_id.price * item.quantity).toFixed(2)}
                </Text>
              )}
              <Text>{item.quantity}</Text>
            </Group>
          </div>
        ))}
      </Stack>
      <Group>
        {user?.idDefaultPayment === import.meta.env.VITE_DEFAULT && (
          <Text> Bạn chưa nhập thanh toán</Text>
        )}
        {user?.idDefaultPayment !== import.meta.env.VITE_DEFAULT && (
          <Text>Thanh toán của bạn là {user?.idDefaultPayment}</Text>
        )}
      </Group>

      <Group>
        <Text>Tổng tiền: {order?.totalPrice}</Text>
        <Text>Tổng sản phẩm: {order?.totalQuantity}</Text>
      </Group>
      <Button
        onClick={() => {
          if (auth.isLoggedIn) {
            if (
              user?.idDefaultAddress === import.meta.env.VITE_DEFAULT ||
              user?.idDefaultPayment === import.meta.env.VITE_DEFAULT
            ) {
              alert("Bị lỗi, đơn hàng rổng");
              return;
            } else handlerSend();
          }
        }}
      >
        Thanh toán và đặt hàng
      </Button>
    </Container>
  );
}

export default CheckOutContent;
