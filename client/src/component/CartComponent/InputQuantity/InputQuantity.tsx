import {
  Group,
  ActionIcon,
  NumberInput,
  rem,
  createStyles,
  Overlay,
  Text,
  Modal,
  Box,
  Stack,
  Title,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useRef, memo, useState } from "react";
const useStyle = createStyles(() => ({
  numberInput: {
    background: "white",
    padding: 0,
  },
}));
import { notifications } from "@mantine/notifications";
import { useUpdateCartMutation } from "../../../api/CartReducer/CartApi";
import { useUpdateDeleteCartItemMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { useDeleteCartMutation } from "../../../api/CartReducer/CartApi";
import { MathFunction } from "../../../Helper/MathFunction";

function isNumberKey(event: React.KeyboardEvent<HTMLInputElement>) {
  if (!/[1-9]/.test(event.key)) {
    event.preventDefault();
  }
}
type handlersTpye = {
  setItemProp: (index: number, prop: string, value: number) => void;
  remove: (index: number) => void;
};
const InputQuantity = memo(function InputQuantity({
  value,
  isFetching,
  id,
  isActive,
  price,
  index,
  discount,
  userId,
  setIdFetching,
  handlersChange,
  cartId,
  quantity,
}: {
  value: number;
  userId: string;
  cartId: string;
  index: number;
  quantity: number;

  handlersChange: handlersTpye;
  setIdFetching: (id: string) => void;
  isActive: boolean;
  discount: number;
  price: number;
  isFetching: boolean;
  refetch: () => void;
  id: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateDeleteCartItem] = useUpdateDeleteCartItemMutation();
  const [deleteCart] = useDeleteCartMutation();
  const [updateCart, { isLoading }] = useUpdateCartMutation();
  const [opened, { open, close }] = useDisclosure(false);

  const [inputValue, setInputValue] = useState<number>(value ? value : 0);

  const { classes } = useStyle();

  const handleChangeTotal = (quantityValue: number) => {
    handlersChange.setItemProp(index, "quantity", quantityValue);
    if (isActive) {
      handlersChange.setItemProp(
        index,
        "price",
        parseInt(
          (MathFunction(price, discount) * quantityValue).toFixed(2) as string
        )
      );
    } else handlersChange.setItemProp(index, "price", price * quantityValue);
  };

  const handleChange = (valueRef: number) => {
    if (valueRef <= 0) {
      setInputValue(value);
      return;
    }
    if (valueRef > quantity) {
      notifications.show({
        id: "overcart",
        title: "Hàng quá tải",
        message: "Quả tải đơn hàng",
      });

      setInputValue(quantity);
      return;
    }

    if (!(inputRef.current === document.activeElement)) {
      setIdFetching(id);
      setInputValue(valueRef);

      updateCart({
        product_id: id,
        quantity: valueRef,
      })
        .unwrap()
        .then(() => {
          setIdFetching("");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      {isFetching && isLoading && <Overlay color="#fff" opacity={0.6} />}
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
      >
        <Box h={200}>
          <Stack spacing={60} justify="center" align="center" h={"100%"}>
            <Title order={3} color={"red"}>
              Bạn có muốn xóa sản phẩm này?
            </Title>
            <Group noWrap grow spacing={15} w="100%">
              <Button
                color="red"
                onClick={() => {
                  updateDeleteCartItem({
                    CartItemId: cartId,
                    id: userId,
                  })
                    .unwrap()
                    .then((res) => {
                      handlersChange.remove(index);
                      close();
                    })
                    .catch((err) => console.log(err));
                  deleteCart({ product_id: id });
                }}
              >
                Có
              </Button>
              <Button onClick={() => close()}>Không</Button>
            </Group>
          </Stack>
        </Box>
      </Modal>
      <Group
        spacing={0}
        noWrap
        grow
        sx={{
          position: "relative",
          width: rem(150),
        }}
      >
        <ActionIcon
          radius="0px"
          size={30}
          sx={{
            backgroundColor: "white",
            color: "black",
            borderRight: "0px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
          variant="default"
          onClick={() => {
            if (inputValue === 1) {
              open();
              return;
            } else {
              handleChange(inputValue - 1);
              handleChangeTotal(inputValue - 1);
            }
          }}
        >
          -
        </ActionIcon>
        <NumberInput
          value={inputValue}
          hideControls
          step={1}
          size="30px"
          ref={inputRef}
          onKeyUp={isNumberKey}
          onBlur={() => {
            const valueInput = parseInt(inputRef.current?.value as string);

            if (valueInput >= 1)
              if (value !== valueInput) {
                if (valueInput > quantity) {
                  setInputValue(quantity);
                  return;
                } else setInputValue(valueInput);
                handleChangeTotal(valueInput);
                updateCart({
                  product_id: id,
                  quantity: valueInput,
                })
                  .unwrap()
                  .then((res) => {
                    console.log(res, "từ blur");
                  })
                  .catch((err) => console.log(err));
              }
          }}
          className={classes.numberInput}
          min={1}
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
        />
        <ActionIcon
          size={30}
          sx={{
            backgroundColor: "white",
            color: "black",
            borderLeft: "0px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
          radius="0px"
          variant="default"
          onClick={() => {
            if (inputValue + 1 > quantity) {
              notifications.show({
                id: "overcart",
                title: "Hàng quá tải",
                message: "Quả tải đơn hàng",
              });
              return;
            } else {
              handleChange(inputValue + 1);
              handleChangeTotal(inputValue + 1); //optimistic update,
            }
          }}
        >
          +
        </ActionIcon>
      </Group>
      <Box>
        {isActive && (
          <Text>
            {"$"}
            {(MathFunction(price, discount) * inputValue).toFixed(2)}
          </Text>
        )}
        {!isActive && <Text>${(price * inputValue).toFixed(2)}</Text>}
      </Box>
    </>
  );
});

export default InputQuantity;
