import type { ProductType } from "../../../../api/ProductReducer/ProductApi";
import {
  Box,
  Group,
  Stack,
  Text,
  Rating,
  Indicator,
  Badge,
  Divider,
  ActionIcon,
  TextInput,
  rem,
  Button,
} from "@mantine/core";
import { useContext, useState } from "react";
import { MathFunction } from "../../../../Helper/MathFunction";
import { ErrorContext } from "../../../ErrorContext/ErrorContext";
import { useUpdateCartItemMutation } from "../../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { useCreateCartMutation } from "../../../../api/CartReducer/CartApi";
import { useAppSelector } from "../../../../app/hooks";
import { selectAuth } from "../../../../api/AuthReducer/AuthReduce";
import { ModalContext } from "../../../ModalContext/ModalContext";
import { useGetReviewProductQuery } from "../../../../api/ProductReducer/ProductApi";
function ProductDetail({ data }: { data: ProductType | undefined }) {
  const [inputValue, setInputValue] = useState("1");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { open, close } = useContext(ModalContext)!;
   
  const { setData, setError } = useContext(ErrorContext);
  const [updateCartItem] = useUpdateCartItemMutation();
  const [createCart] = useCreateCartMutation();
  const { data: ReviewProduct } = useGetReviewProductQuery(
    data ? data._id : "",
    {
      skip: data === undefined,
    }
  );
  const auth = useAppSelector(selectAuth);
  const handleAddCartItem = (productId: string, quantity: number) => {
    createCart({ product_id: productId, quantity: quantity })
      .unwrap()
      .then((res) => {
        open();
        setTimeout(() => {
          close();
        }, 2000);
        updateCartItem({ CartItemId: res.data._id, id: auth.id })
          .unwrap()
          .then(() => {
            setData("Successful");
          });
      })
      .catch((err) =>
        setError({
          message: err.message,
        })
      );
  };
  if (data === undefined) return <></>;
  const handleChange = (value: string) => {
    value = value.replace(/\D/g, "");
    if (parseInt(value) < 1) setInputValue("1");
    else if (parseInt(value) > (data.inventory_id?.quantity ?? 1))
      setInputValue(data.inventory_id?.quantity.toString() ?? "1");
    else if (value === "") setInputValue("");
    else setInputValue(value);
  };

  return (
    <Box>
      <Box>
        <Stack>
          <Indicator
            disabled={!data.discount_id?.active}
            position="top-start"
            label="Giảm giá!!"
            inline
            color="red"
            size={18}
          >
            <Text
              size="30px"
              variant="gradient"
              weight={1000}
              gradient={{
                from: "white",
                to: "yellow",
              }}
            >
              {data.name}
            </Text>
          </Indicator>
          <Group>
            <Group noWrap spacing={10}>
              <Text size="16px" weight={300} underline color="orange">
                {ReviewProduct
                  ? ReviewProduct.reduce(
                      (a, b) => a + b.user_rating.rating_value,
                      0
                    ).toFixed(2)
                  : 0}
              </Text>
              <Divider orientation="vertical" color="gray" />
              <Rating
                fractions={10}
                value={
                  ReviewProduct
                    ? ReviewProduct.reduce(
                        (a, b) => a + b.user_rating.rating_value,
                        0
                      )
                    : 0
                }
                readOnly
              />
              <Divider orientation="vertical" color="gray" />
              <Text>{ReviewProduct ? ReviewProduct.length : 0} đánh giá</Text>
            </Group>
            <Group noWrap spacing={10}>
              <Divider orientation="vertical" color="gray" />
              <Text>{data.amountPurchased} : đã bán</Text>
            </Group>
          </Group>
          <Group>
            {data.discount_id?.active ? (
              <>
                <Text strikethrough size="40px">
                  ${data.price}
                </Text>

                <Text size="40px" color="orange">
                  - $
                  {MathFunction(data.price, data.discount_id.discount_percent)}
                </Text>
                <Text>
                  <Badge
                    variant="gradient"
                    gradient={{ from: "orange", to: "red" }}
                  >
                    {data.discount_id.discount_percent}% giảm giá
                  </Badge>
                </Text>
              </>
            ) : (
              <Text size="40px">{data.price}</Text>
            )}
          </Group>
        </Stack>
      </Box>
      <Divider />
      <Box mt="10px">
        <Stack>
          <Text size="16px" weight={300}>
            {data.desc}
          </Text>
          <Text>SKU: {data.SKU}</Text>
          <Group>
            <Text>Số lượng</Text>
            <Group noWrap spacing={0} w={"100px"}>
              <ActionIcon
                size={30}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "0px",

                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  "&:active": {
                    transform: "none",
                    border: "1px solid red",
                  },
                }}
                onClick={() => {
                  if (parseInt(inputValue) <= 1) {
                    alert("Input không thể nhỏ hơn 1");
                    return;
                  }
                  setInputValue((parseInt(inputValue) - 1).toString());
                }}
              >
                -
              </ActionIcon>
              <TextInput
                size="31px"
                value={inputValue}
                onChange={(e) => {
                  handleChange(e.target.value);
                }}
                onBlur={() => {
                  if (inputValue === "" || !inputValue) {
                    setInputValue("1");
                  }
                }}
                styles={{
                  wrapper: {
                    borderRadius: "0px",
                  },

                  input: {
                    boxSizing: "border-box",
                    fontSize: rem(14),
                    color: "black",
                    borderRadius: "0px",
                    textAlign: "center",
                    backgroundColor: "white",
                  },
                }}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderLeft: "0px",
                  cursor: "pointer",

                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
              <ActionIcon
                size={30}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderLeft: "0px",
                  cursor: "pointer",
                  borderRadius: "0px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  "&:active": {
                    transform: "none",
                    border: "1px solid red",
                  },
                }}
                onClick={() => {
                  if (parseInt(inputValue) === data.inventory_id?.quantity) {
                    alert("Vượt quá số lượng đơn hàng");
                    return;
                  }
                  setInputValue((parseInt(inputValue) + 1).toString());
                }}
              >
                +
              </ActionIcon>
            </Group>
            <Group noWrap spacing={3}>
              <Text>Số lượng tồn to : </Text>
              <Text>{data.inventory_id?.quantity}</Text>
            </Group>
          </Group>
        </Stack>
      </Box>
      <Box mt="20px">
        <Button
          variant="light"
          color="blue"
          onClick={() => {
            handleAddCartItem(data._id, parseInt(inputValue) ?? 1);
          }}
        >
          Add Cart
        </Button>
      </Box>
    </Box>
  );
}

export default ProductDetail;
