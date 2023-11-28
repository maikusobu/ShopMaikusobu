import {
  Container,
  Title,
  Group,
  Box,
  Image,
  Text,
  createStyles,
  rem,
  Checkbox,
  ActionIcon,
  Button,
  Stack,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useGetShoppingSessionQuery } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { useUpdateDeleteCartItemMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { useDeleteCartMutation } from "../../../api/CartReducer/CartApi";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import { InsertOrder } from "../../../api/OrderReducer/OrderReducer";
import { useUpdateDeleteAllCartItemMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import InputQuantity from "../InputQuantity/InputQuantity";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MathFunction } from "../../../Helper/MathFunction";
import { notifications } from "@mantine/notifications";
/**
 * Styles for the CartContent component.
 */
const useStyle = createStyles(() => ({
  backgroundUL: {
    color: "black",
    padding: "0px",
    justifyContent: "space-between",

    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  list: {
    listStyleType: "none",
    display: "flex",
    height: "150px",
    padding: "0px 20px",
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  numberInput: {
    background: "white",
    padding: 0,
  },
  boxContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
  groupContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
  orderBand: {
    width: "100%",
    height: "150px",
    backgroundColor: "white",
    position: "sticky",
    display: "flex",
    alignItems: "center",

    padding: "20px",
    bottom: "0px",
    boxShadow: "1px 1px 15px rgba(0, 0, 0, 0.1)",
  },
}));
interface orderItem {
  key: string;
  product_id: string;
  quantity: number;
  checked: boolean;
  price: number;
}
function CartContent() {
  const { classes } = useStyle();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const [idFetching, setIdFetching] = useState<string>("");
  const navigate = useNavigate();
  const [updateDeleteCartItem] = useUpdateDeleteCartItemMutation();
  const [deleteCart] = useDeleteCartMutation();
  const { data, isLoading, refetch } = useGetShoppingSessionQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });

  const [updateDeleteAllCartItem] = useUpdateDeleteAllCartItemMutation();
  const initialValues = useMemo(
    () =>
      data?.cart_items.map((cart_item) => ({
        key: cart_item._id,
        product_id: cart_item.product_id._id,
        quantity: cart_item.quantity,
        price: cart_item.product_id.discount_id?.active
          ? MathFunction(
              cart_item.product_id.price,
              cart_item.product_id.discount_id.discount_percent
            ) * Number(cart_item.quantity.toFixed(2))
          : cart_item.product_id.price * Number(cart_item.quantity.toFixed(2)),
        checked: false,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading]
  );

  const [values, handlers] = useListState(initialValues);
  const allChecked = values?.every((value) => value.checked);
  const indeterminate = values?.some((value) => value.checked) && !allChecked;
  const isSomeChecked = values?.some((value) => value.checked);
  console.log(data);
  useEffect(() => {
    handlers.setState(initialValues as orderItem[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);
  return (
    <>
      <Container>
        <Title
          bg="white"
          mb="20px"
          h={90}
          pl="20px"
          pr="20px"
          pt="20px"
          align="center"
          color="black"
        >
          Your Cart
        </Title>
        <Group
          px="20px"
          position="apart"
          bg="white"
          sx={{ color: "black", height: "40px", fontWeight: "bold" }}
          mb="10px"
        >
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            transitionDuration={0}
            onChange={() =>
              handlers.setState((current) =>
                current.map((value) => ({ ...value, checked: !allChecked }))
              )
            }
          />
          <Text w={220}>Sản phẩm</Text>
          <Text w={100} align="center">
            Đơn giá
          </Text>
          <Text sx={{ transform: "translateX(20%)" }} align="center">
            Số lượng
          </Text>
          <Text w={60} align="center" sx={{ transform: "translateX(40%)" }}>
            Số tiền
          </Text>
          <Text>Xóa</Text>
        </Group>

        {
          <ul className={classes.backgroundUL}>
            {data?.cart_items.map((cart_item, i) => (
              <li className={classes.list} key={cart_item.product_id._id}>
                <Box className={classes.boxContainer}>
                  <Group className={classes.groupContainer}>
                    <Group w={350} noWrap>
                      <Checkbox
                        key={values ? values[i]?.key : i}
                        checked={values ? values[i]?.checked : false}
                        onChange={(event) =>
                          handlers.setItemProp(
                            i,
                            "checked",
                            event.currentTarget.checked
                          )
                        }
                      />
                      <Image
                        src={cart_item.product_id.image[0]}
                        width={80}
                      ></Image>
                      <Text truncate>{cart_item.product_id.name}</Text>
                    </Group>
                    <Group noWrap spacing={5} w={100} position="center">
                      <Text
                        strikethrough={cart_item.product_id.discount_id?.active}
                      >
                        ${cart_item.product_id.price as number}
                      </Text>
                      {cart_item.product_id.discount_id?.active && (
                        <Text>
                          $
                          {
                            MathFunction(
                              cart_item.product_id.price as number,
                              cart_item.product_id.discount_id
                                ?.discount_percent ?? 1
                            ) as number
                          }
                        </Text>
                      )}
                    </Group>
                    <Group
                      sx={{ position: "relative", width: rem(260) }}
                      noWrap
                      position="apart"
                    >
                      <InputQuantity
                        userId={auth.id}
                        index={i}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        handlersChange={handlers as any}
                        refetch={refetch}
                        quantity={
                          cart_item.product_id.inventory_id?.quantity ?? 10000
                        }
                        cartId={cart_item._id}
                        price={cart_item.product_id.price as number}
                        discount={
                          cart_item.product_id.discount_id?.discount_percent ??
                          1
                        }
                        isActive={
                          cart_item.product_id.discount_id?.active as boolean
                        }
                        isFetching={idFetching === cart_item.product_id._id}
                        setIdFetching={setIdFetching}
                        value={cart_item.quantity}
                        id={cart_item.product_id._id}
                      />
                    </Group>
                    <ActionIcon
                      onClick={() => {
                        updateDeleteCartItem({
                          CartItemId: cart_item._id,
                          id: auth.id,
                        })
                          .unwrap()
                          .then(() => {
                            handlers.remove(i);
                          })
                          .catch((err) => console.log(err));
                        deleteCart({ product_id: cart_item.product_id._id });
                      }}
                    >
                      <IconTrash color="black" />
                    </ActionIcon>
                  </Group>
                </Box>
              </li>
            ))}
          </ul>
        }
        <div className={classes.orderBand}>
          <Group position="apart" sx={{ flex: 1 }}>
            <Stack>
              <Text color="black" weight="bold">
                Chọn tất cả
              </Text>
              <Checkbox
                checked={allChecked}
                indeterminate={false}
                transitionDuration={0}
                onChange={() =>
                  handlers.setState((current) =>
                    current.map((value) => ({ ...value, checked: !allChecked }))
                  )
                }
              />
            </Stack>
            <Group w="200px">
              <Text color="black">Tổng sản phẩm: </Text>
              <Text color="black" weight="bold">
                {values
                  ? values.reduce((acc, curr) => {
                      if (curr.checked) return acc + curr.quantity;
                      else return acc;
                    }, 0)
                  : 0}
              </Text>
            </Group>
            <Group w="200px">
              <Text color="black">Thành tiền:</Text>
              <Text color="black" weight="bold">
                {"$"}
                {values
                  ? values
                      .reduce((acc, curr) => {
                        if (curr.checked) return acc + curr.price;
                        else return acc;
                      }, 0)
                      .toFixed(2)
                  : 0}
              </Text>
            </Group>
            <Group>
              <Button
                onClick={() => {
                  if (data?.cart_items.length === 0) {
                    alert("Giỏ hàng trở thành rỗng");
                    return;
                  } else {
                    updateDeleteAllCartItem(auth.id)
                      .unwrap()
                      .then(() => handlers.setState([]))
                      .catch(() => window.location.reload());
                  }
                }}
              >
                Xóa tất cả
              </Button>
              <Button
                onClick={() => {
                  if (!isSomeChecked) {
                    notifications.show({
                      id: "NotChecked",
                      withCloseButton: true,
                      autoClose: 1000,

                      message: "Bạn vẫn chưa chọn sản phẩm",
                      color: "white",

                      style: { backgroundColor: "red", color: "white" },
                      sx: { backgroundColor: "red", color: "white" },
                      loading: false,
                    });
                    return;
                  }
                  if (data?.cart_items.length === 0) {
                    alert("Giỏ hàng trở thành rỗng");
                    return;
                  }
                  dispatch(
                    InsertOrder({
                      totalPrice: values.reduce((acc, curr) => {
                        if (curr.checked) return acc + curr.price;
                        else return acc;
                      }, 0),

                      totalQuantity: values.reduce((acc, curr) => {
                        if (curr.checked) return acc + curr.quantity;
                        else return acc;
                      }, 0),
                    })
                  );
                  navigate("/shopping/checkout");
                }}
              >
                Đặt hàng
              </Button>
            </Group>
          </Group>
        </div>
      </Container>
    </>
  );
}

export default CartContent;
