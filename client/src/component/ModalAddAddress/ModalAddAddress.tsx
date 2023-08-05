/* eslint-disable no-unused-labels */
import React, { createContext, useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Stack,
  Select,
  Group,
  Text,
  createStyles,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import type { ModalContextType } from "../ModalContext/ModalContext";
import { districts, wards } from "../../api/VnProvincesApi/VnProvincesApi";
import { useGetProvincesQuery } from "../../api/VnProvincesApi/VnProvincesApi";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../app/hooks";
import { useGetUserAddressesQuery } from "../../api/UserApi/UserAddressMangaerApi";
import { useCreateUserAddressMutation } from "../../api/UserApi/UserAdressApi";
import { useUpdateInsertAddressMutation } from "../../api/UserApi/UserAddressMangaerApi";
import { useUpdateUserMutation } from "../../api/UserApi/UserApi";
export const AddressContext = createContext<ModalContextType | null>(null);
const useStyles = createStyles(() => ({
  formContainer: {
    width: "100%",
    height: "300px",
  },
}));
function AddressProvider({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { classes } = useStyles();
  const { data: provinces } = useGetProvincesQuery();
  const [valueChecked, setValueChecked] = useState(false);
  const auth = useAppSelector(selectAuth);
  const { data: UserAddress } = useGetUserAddressesQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const [createUserAddress] = useCreateUserAddressMutation();
  const [updateInsertAddress] = useUpdateInsertAddressMutation();
  const [updateUser] = useUpdateUserMutation();

  const form = useForm({
    initialValues: {
      province_code: "",
      district_code: "",
      ward_code: "",
      address_line_option: "",
    },
    validate: {
      province_code: (value) =>
        value ? null : "Vui lòng chọn tỉnh / thành phố ",
      district_code: (value) => (value ? null : "Vui lòng chọn huyện / quận"),
      ward_code: (value) => (value ? null : "Vui lòng chọn xã / phường"),
    },
  });
  const arrayDistricts = (province: string | null) => {
    return province
      ? provinces?.filter((item) => item.codename === province)[0]?.districts
      : [];
  };

  const arrayWards = (district: string | null) => {
    return district
      ? arrayDistricts(form.values.province_code)?.filter(
          (item) => item.codename === district
        )[0]?.wards
      : [];
  };
  const onHandleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.isValid()) {
      form.validate();
      return;
    }
    const formdata = {
      user_id: auth.id,
      ...form.values,
    };

    createUserAddress(formdata)
      .unwrap()
      .then((res) => {
        console.log(import.meta.env.VITE_DEFAULT);
        if (valueChecked === true || UserAddress?.address_list.length === 0)
          updateUser({
            id: auth.id,
            idDefaultAddress: res.data._id,
          })
            .unwrap()
            .then((resS) => console.log(resS))
            .catch(console.log);
        updateInsertAddress({
          user_id: auth.id,
          address_id: res.data._id,
        })
          .unwrap()
          .then(close)
          .catch(console.log);
      })
      .catch(console.log);
  };
  return (
    <AddressContext.Provider value={{ open, close }}>
      <Modal
        opened={opened}
        onClose={close}
        title="Add Address"
        size={700}
        centered
        withCloseButton
      >
        <form className={classes.formContainer} onSubmit={onHandleSumbit}>
          <Stack>
            <Group noWrap w="100%">
              <Stack w="140x">
                <Text>Thành phố \ Tỉnh</Text>
                <Select
                  searchable
                  dropdownPosition="bottom"
                  clearable
                  nothingFound="Không tìm thấy"
                  {...form.getInputProps("province_code")}
                  data={provinces ? provinces : []}
                  error={form.errors.province_code}
                />
              </Stack>
              <Stack>
                <Text>Quận \ Huyện</Text>
                <Select
                  searchable
                  dropdownPosition="bottom"
                  clearable
                  nothingFound="Không tìm thấy"
                  {...form.getInputProps("district_code")}
                  data={
                    form.values.province_code
                      ? (arrayDistricts(form.values.province_code) as
                          | districts[]
                          | [])
                      : []
                  }
                  error={form.errors.district_code}
                />
              </Stack>
              <Stack>
                <Text>Phường \ Xã</Text>
                <Select
                  searchable
                  dropdownPosition="bottom"
                  clearable
                  nothingFound="Không tìm thấy"
                  {...form.getInputProps("ward_code")}
                  data={
                    form.values.district_code
                      ? (arrayWards(form.values.district_code) as wards[] | [])
                      : []
                  }
                  error={form.errors.ward_code}
                />
              </Stack>
            </Group>
            <TextInput
              placeholder="Nhập địa chỉ thêm"
              {...form.getInputProps("address_line_option")}
            />
          </Stack>
          <Group grow noWrap>
            <Checkbox
              label="Đặt làm mặc định"
              checked={valueChecked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValueChecked(e.target.checked)
              }
            />
            <Button type="submit" variant="light">
              Save
            </Button>
          </Group>
        </form>
      </Modal>
      {children}
    </AddressContext.Provider>
  );
}

export default AddressProvider;
