import {
  Group,
  ActionIcon,
  NumberInput,
  rem,
  NumberInputHandlers,
  createStyles,
  Overlay,
  Box,
  Text,
} from "@mantine/core";
import React, { useRef, memo, useState } from "react";
const useStyle = createStyles(() => ({
  numberInput: {
    background: "white",
    padding: 0,
  },
}));
import { useDeleteCartMutation } from "../../../api/CartReducer/CartApi";
import { useUpdateCartMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { MathFunction } from "../../../Helper/MathFunction";

function isNumberKey(event: React.KeyboardEvent<HTMLInputElement>) {
  // get the key code of the pressed key
  const keyCode = parseInt(event.key);
  // return true if the key code is between 48 and 57 (the ASCII codes for 0 to 9)
  // return false otherwise
  return keyCode >= 48 && keyCode <= 57;
}
const InputQuantity = memo(function InputQuantity({
  value,
  isFetching,
  id,
  isActive,
  price,
  discount,
  refetch,
  setIdFetching,
}: {
  value: number;
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
  const [updateCart, { isLoading }] = useUpdateCartMutation();
  const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation();
  const [inputValue, setInputValue] = useState<number>(value);

  const { classes } = useStyle();

  const handleChange = (valueRef: number) => {
    if (valueRef <= 0) return;

    if (!(inputRef.current === document.activeElement)) {
      setIdFetching(id);
      updateCart({
        product_id: id,
        quantity: valueRef,
      })
        .unwrap()
        .then((res) => {
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
          onClick={() => handlers.current?.decrement()}
        >
          -
        </ActionIcon>
        <NumberInput
          value={inputValue}
          hideControls
          size="30px"
          ref={inputRef}
          onKeyUp={isNumberKey}
          onBlur={() => {
            const valueInput = parseInt(inputRef.current?.value as string);
            console.log(value, valueInput);
            if (value !== valueInput) {
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
