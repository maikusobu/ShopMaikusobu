import {
  Container,
  Title,
  Group,
  Box,
  Image,
  Text,
  createStyles,
  rem,
  ActionIcon,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useGetShoppingSessionQuery } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { useUpdateDeleteCartItemMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import InputQuantity from "../InputQuantity/InputQuantity";
import { useState } from "react";
import { useDeleteCartMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { MathFunction } from "../../../Helper/MathFunction";
const useStyle = createStyles(() => ({
  backgroundUL: {
    color: "black",
    padding: "15px 20px",
    justifyContent: "space-between",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  list: {
    listStyleType: "none",
    display: "flex",
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
}));
function CartContent() {
  const { classes } = useStyle();

  const auth = useAppSelector(selectAuth);
  const [idFetching, setIdFetching] = useState<string>("");
  const [deleteCart] = useDeleteCartMutation();
  const [updateDeleteCartItem] = useUpdateDeleteCartItemMutation();
  const { data, isLoading, isFetching, refetch } = useGetShoppingSessionQuery(
    auth.id,
    {
      skip: !auth.isLoggedIn,
    }
  );
  console.log(data?.cart_items);

  return (
    <Container>
      <h1> is fetching : {isFetching ? "yes" : "not"} </h1>
      <h1> is loading: {isLoading ? "yes" : "not"} </h1>
      <Title>Your Cart</Title>
      <Group>
        <Text>Product</Text>
        <Text>Unit Price</Text>
      </Group>

      {
        <ul className={classes.backgroundUL}>
          {data?.cart_items.map((cart_item) => (
            <li className={classes.list} key={cart_item.product_id._id}>
              <Box className={classes.boxContainer}>
                <Group className={classes.groupContainer}>
                  <Group w={300} noWrap>
                    <Image
                      src={cart_item.product_id.image[0]}
                      width={50}
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
                      refetch={refetch}
                      price={cart_item.product_id.price as number}
                      discount={
                        cart_item.product_id.discount_id?.discount_percent ?? 1
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
                        .then((res) => console.log(res))
                        .catch((err) => console.log(err));
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
    </Container>
  );
}

export default CartContent;
