import React, { useContext } from "react";
import {
  TextInput,
  Select,
  Button,
  Group,
  createStyles,
  Stack,
  Text,
  Box,
} from "@mantine/core";
import { useGetProvincesQuery } from "../../api/VnProvincesApi/VnProvincesApi";
import { useGetUserAddressesQuery } from "../../api/UserApi/UserAddressMangaerApi";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { AddressContext } from "../ModalAddAddress/ModalAddAddress";
interface Address {
  address_line1: string;
  address_line2?: string;
  city: string;
  country: string;
}
const useStyles = createStyles(() => ({
  form: {
    width: "50%",
  },
}));
const UserAddressForm = () => {
  const auth = useAppSelector(selectAuth);
  const { data: AdressUser } = useGetUserAddressesQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const { data: provinces } = useGetProvincesQuery();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  console.log(AdressUser);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { open, close } = useContext(AddressContext)!;
  return (
    <Box>
      <Group>
        <Text>Địa chỉ của bạn</Text>
        <Button
          onClick={() => {
            open();
          }}
        >
          Thêm địa chỉ mới
        </Button>
      </Group>
      {AdressUser?.address_list?.length === 0 && (
        <Stack>
          <Text>Bạn chưa nhập địa chỉ</Text>
        </Stack>
      )}
      <Stack>
        {AdressUser?.address_list.map((item) => (
          <Group>
            <Text>{item.province_code}</Text>
            <Text>{item.district_code}</Text>
            <Text>{item.ward_code}</Text>
          </Group>
        ))}
      </Stack>
    </Box>
  );
};
export default UserAddressForm;
