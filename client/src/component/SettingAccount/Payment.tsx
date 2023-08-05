import {
  Button,
  Title,
  createStyles,
  Text,
  Group,
  Stack,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import type { UserPaymentModel } from "../../api/UserApi/UserPaymentManagerApi";
import { useGetUserPaymentByIdQuery } from "../../api/UserApi/UserPaymentManagerApi";
import { useGetUserByIdQuery } from "../../api/UserApi/UserApi";
import { useUpdateUserMutation } from "../../api/UserApi/UserApi";
import { useContext } from "react";
import { ModalAddPaymentContext } from "../ModalAddPayment/ModalAddPayment";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
const useStyles = createStyles((theme) => ({
  bgDiv: {
    backgroundColor: "#fff",
    color: "black",
    padding: "0.5rem",
    height: "4rem",
    display: "flex",
    border: "5px solid transparent",
    borderRadius: "5px",
  },
  defaultDiv: {
    border: `5px solid ${theme.colors.brandcolorYellow[4]} !important`,
    color: `${theme.colors.brandcolorYellow[4]} !important`,
    fontWeight: 700,
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
  const { data: userData = { idDefaultPayment: undefined } } =
    useGetUserByIdQuery(auth.id, {
      skip: !auth.isLoggedIn,
    });
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const sortArray = (arr: UserPaymentModel[]) => {
    const sortedArray = [...arr];
    const defaultIndex = sortedArray.findIndex(
      (item) => item._id === userData.idDefaultPayment
    );
    sortedArray.unshift(...sortedArray.splice(defaultIndex, 1));

    return sortedArray;
  };

  const handleSetDefault = (item: UserPaymentModel) => {
    const newUserData = { ...userData, idDefaultPayment: item._id };

    updateUser(newUserData)
      .unwrap()
      .then(() => {
        // notifications
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
        overlayOpacity={0.8}
        overlayColor="#c5c5c5"
        visible={isLoading}
      />

      <Group noWrap grow mb={10}>
        <Text>Your payment</Text>
        <Button onClick={open}>Thêm phương thức thanh toán</Button>
      </Group>
      {data?.payment_list.length === 0 && (
        <Title order={3}>
          Bạn cần thêm phương thức thanh toán để được mua hàng
        </Title>
      )}
      <Stack spacing={10}>
        {sortArray(
          data?.payment_list ? data.payment_list : ([] as UserPaymentModel[])
        ).map((item) => (
          <div
            key={item._id}
            className={`${classes.bgDiv} ${
              userData.idDefaultPayment === item._id ? classes.defaultDiv : ""
            }`}
          >
            <Group w="100%" position="apart">
              <Group>
                <Text>{item.payment_type}</Text>
                <Text>{item.card_number}</Text>
              </Group>
              <Group>
                <Button>Xóa</Button>
                <Button>Cập nhật</Button>
                {userData.idDefaultPayment !== item._id && (
                  <Button
                    onClick={() => {
                      handleSetDefault(item);
                    }}
                  >
                    Thiết lập mặc định
                  </Button>
                )}
              </Group>
            </Group>
          </div>
        ))}
      </Stack>
    </Box>
  );
}

export default UserPaymentForm;
