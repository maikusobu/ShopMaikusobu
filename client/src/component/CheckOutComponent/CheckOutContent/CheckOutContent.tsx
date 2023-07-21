import { useGetUserByIdQuery } from "../../../api/UserApi/UserApi";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import { Button, Container, Group, Stack, Text } from "@mantine/core";
import { useGetShoppingSessionQuery } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { MathFunction } from "../../../Helper/MathFunction";
import { selectOrder } from "../../../api/OrderReducer/OrderReducer";
function CheckOutContent() {
  const auth = useAppSelector(selectAuth);
  const order = useAppSelector(selectOrder);
  const { data: user } = useGetUserByIdQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const { data, isLoading, refetch } = useGetShoppingSessionQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  return (
    <Container>
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
              user?.idDefaultPayment !== import.meta.env.VITE_DEFAULT
            ) {
              alert("Bị lỗi, bỏ qua ġn hàng");
              return;
            }
          }
        }}
      >
        Thanh toán và đặt hàng
      </Button>
    </Container>
  );
}

export default CheckOutContent;
