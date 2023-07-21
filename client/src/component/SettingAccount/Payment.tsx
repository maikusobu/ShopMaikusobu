import React from "react";
import {
  TextInput,
  Select,
  Button,
  Title,
  createStyles,
  Text,
  Indicator,
  Group,
  Stack,
  Box,
} from "@mantine/core";
import type { UserPaymentModel } from "../../api/UserApi/UserPaymentManagerApi";
import { useGetUserPaymentByIdQuery } from "../../api/UserApi/UserPaymentManagerApi";
import { useGetUserByIdQuery } from "../../api/UserApi/UserApi";
import { useContext } from "react";
import { ModalAddPaymentContext } from "../ModalAddPayment/ModalAddPayment";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
const useStyles = createStyles(() => ({
  formContainer: {
    "& > *": {
      marginTop: "1.2rem",
    },
    "& > *:first-child": {
      marginTop: 0,
    },
  },
  bgDiv: {
    backgroundColor: "#fff",
    color: "black",
    padding: "0.5rem",
    height: "4rem",
    display: "flex",
  },
}));

function UserPaymentForm() {
  const { classes } = useStyles();
  const auth = useAppSelector(selectAuth);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { open } = useContext(ModalAddPaymentContext)!;
  const { data } = useGetUserPaymentByIdQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const { data: userData } = useGetUserByIdQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const sortArray = (arr: UserPaymentModel[]) => {
    return arr;
  };

  return (
    <Box>
      <Group noWrap grow>
        <Text>Your payment</Text>
        <Button onClick={open}>Thêm địa chỉ mới</Button>
      </Group>
      {data?.payment_list.length === 0 && (
        <Title order={3}>Bạn cần thêm địa chỉ để được mua hàng</Title>
      )}
      <Stack spacing={10}>
        {sortArray(
          data?.payment_list ? data.payment_list : ([] as UserPaymentModel[])
        ).map((item, i) => (
          <div key={item._id} className={classes.bgDiv}>
            <Group w="100%" position="apart">
              <Text>{item.payment_type}</Text>
              <Text>{item.card_number}</Text>
              <Button>Xóa</Button>
              <Button>Cập nhật</Button>
              {i !== 0 && <Button>Thiết lập mặc định</Button>}
            </Group>
          </div>
        ))}
      </Stack>
    </Box>
  );
}

export default UserPaymentForm;
