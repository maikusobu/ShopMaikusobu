import {
  Group,
  ActionIcon,
  NumberInput,
  rem,
  NumberInputHandlers,
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
import React, { useRef, memo, useState, useEffect } from "react";
const useStyle = createStyles(() => ({
  numberInput: {
    background: "white",
    padding: 0,
  },
}));
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
  refetch,
  setIdFetching,
  handlersChange,
  cartId,
}: {
  value: number;
  userId: string;
  cartId: string;
  index: number;
  handlersChange: handlersTpye;
  setIdFetching: (id: string) => void;
  isActive: boolean;
  discount: number;
  price: number;
  isFetching: boolean;
  refetch: () => void;
  id: string;
}) {
  const handlers = useRef<NumberInputHandlers>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateDeleteCartItem] = useUpdateDeleteCartItemMutation();
  const [deleteCart] = useDeleteCartMutation();
  const [updateCart, { isLoading }] = useUpdateCartMutation();
  const [opened, { open, close }] = useDisclosure(false);

  const [inputValue, setInputValue] = useState<number>(value);

  const { classes } = useStyle();

  const handleChangeTotal = () => {
    handlersChange.setItemProp(index, "quantity", inputValue);
    if (isActive) {
      handlersChange.setItemProp(
        index,
        "price",
        parseInt(
          (MathFunction(price, discount) * inputValue).toFixed(2) as string
        )
      );
    } else handlersChange.setItemProp(index, "price", price * inputValue);
  };

  const handleChange = (valueRef: number) => {
    if (valueRef <= 0) {
      setInputValue(value);
      return;
    }
    if (!(inputRef.current === document.activeElement)) {
      setIdFetching(id);
      handleChangeTotal();
      updateCart({
        product_id: id,
        quantity: valueRef,
      })
        .unwrap()
        .then((res) => {
          handlersChange.setItemProp(index, "quantity", valueRef);
          setIdFetching("");
          setInputValue(valueRef);

          console.log(res, "từ change");
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
                      console.log(res);
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
            } else handlers.current?.decrement();
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
            console.log(valueInput);
            if (valueInput >= 1)
              if (value !== valueInput) {
                handleChangeTotal();
                setInputValue(valueInput);
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
          handlersRef={handlers}
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
          onChange={handleChange}
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
          onClick={() => handlers.current?.increment()}
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
