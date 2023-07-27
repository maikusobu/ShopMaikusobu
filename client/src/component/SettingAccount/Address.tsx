import { useContext } from "react";
import { Button, Group, Stack, Text, Box } from "@mantine/core";
import { useGetUserAddressesQuery } from "../../api/UserApi/UserAddressMangaerApi";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { AddressContext } from "../ModalAddAddress/ModalAddAddress";

const UserAddressForm = () => {
  const auth = useAppSelector(selectAuth);
  const { data: AdressUser } = useGetUserAddressesQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  console.log(AdressUser);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { open } = useContext(AddressContext)!;
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
