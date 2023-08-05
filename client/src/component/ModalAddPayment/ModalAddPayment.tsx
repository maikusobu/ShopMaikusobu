import React, { createContext } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  TextInput,
  Select,
  Button,
  Title,
  createStyles,
  Indicator,
  Group,
  Checkbox,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import type { ModalContextType } from "../ModalContext/ModalContext";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { useState } from "react";
import { useCreateUserPaymentMutation } from "../../api/UserApi/UserPaymentApi";
import { useUpdateInsertPaymentMutation } from "../../api/UserApi/UserPaymentManagerApi";
import { useUpdateUserMutation } from "../../api/UserApi/UserApi";
import { useGetUserPaymentByIdQuery } from "../../api/UserApi/UserPaymentManagerApi";
interface UserPaymentValues {
  payment_type: "credit" | "debit" | "paypal" | "bank";
  card_number: string;
  expire: Date;
}
const useStyles = createStyles(() => ({
  formContainer: {
    width: "100%",
    "& > *": {
      marginTop: "1.2rem",
    },
    "& > *:first-child": {
      marginTop: 0,
    },
  },
}));
const isValidPaymentType = (value: string) => {
  return ["credit", "debit", "paypal", "bank"].includes(value);
};
const isValidCardNumber = (value: string) => {
  // lugn alogirithm
  let nCheck = 0;
  let bEven = false;
  const sNum = value.replace(/\D/g, "");
  for (let n = sNum.length - 1; n >= 0; n--) {
    const cDigit = sNum.charAt(n);
    let nDigit = parseInt(cDigit, 10);
    if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
    nCheck += nDigit;
    bEven = !bEven;
  }
  return nCheck % 10 == 0;
};
const isValidExpireDate = (value: Date) => {
  return value instanceof Date && value > new Date();
};
export const ModalAddPaymentContext = createContext<ModalContextType | null>(
  null
);
function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState(false);
  const { classes } = useStyles();
  const auth = useAppSelector(selectAuth);
  const [createUserPayment] = useCreateUserPaymentMutation();
  const [updateInsertPayment] = useUpdateInsertPaymentMutation();
  const [updateUser] = useUpdateUserMutation();

  const { data: paymentData } = useGetUserPaymentByIdQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const form = useForm<UserPaymentValues>({
    initialValues: {
      payment_type: "credit",
      card_number: "",
      expire: new Date(new Date().getFullYear(), new Date().getMonth() + 1),
    },
    validate: {
      payment_type: (v) =>
        isValidPaymentType(v) ? null : "Invalid payment type!",
      card_number: (v) =>
        isValidCardNumber(v) ? null : "Please typing the valid",
      expire: (v) =>
        isValidExpireDate(v as Date) ? null : "Invalid expire date!",
    },
    validateInputOnChange: true,
  });
  const formatCreditCardNumber = (value: string): string => {
    const valueTrim = value.replace(/\s/g, "").replace(/\D/g, "");
    if (valueTrim.length > 16) return value.slice(0, 19);
    if (valueTrim.length <= 4) return valueTrim;
    if (valueTrim.length <= 8)
      return valueTrim.slice(0, 4) + " " + valueTrim.slice(4, 8);
    if (valueTrim.length <= 12)
      return (
        valueTrim.slice(0, 4) +
        " " +
        valueTrim.slice(4, 8) +
        " " +
        valueTrim.slice(8, 12)
      );
    if (valueTrim.length <= 16)
      return (
        valueTrim.slice(0, 4) +
        " " +
        valueTrim.slice(4, 8) +
        " " +
        valueTrim.slice(8, 12) +
        " " +
        valueTrim.slice(12, 16)
      );
    return value;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    form.setFieldValue(name, formatCreditCardNumber(value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      user_id: auth.id,
      ...form.values,
      expire: form.values.expire.toISOString(),
      card_number: parseInt(form.values.card_number.replace(/\s/g, "")),
    };
    createUserPayment(formData)
      .unwrap()
      .then((data) => {
        if (value === true || paymentData?.payment_list.length === 0)
          updateUser({
            id: auth.id,
            idDefaultPayment: data.data._id,
          })
            .unwrap()
            .then((res) => console.log(res))
            .catch((er) => console.log(er));
        updateInsertPayment({
          user_id: auth.id,
          payment_id: data.data._id,
        })
          .unwrap()
          .then(close)
          .catch((er) => console.log(er));
      })
      .catch((err) => console.log(err));
    //
  };
  return (
    <ModalAddPaymentContext.Provider value={{ open, close }}>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton
        styles={{
          header: {
            zIndex: 0,
          },
        }}
      >
        <form className={classes.formContainer} onSubmit={handleSubmit}>
          <Title order={3}>Payment</Title>
          <Select
            label="Payment Type"
            name="payment_type"
            placeholder="Select payment type"
            value={form.values.payment_type}
            styles={{
              label: {
                fontSize: "0.8rem",
                color: "grey",
              },
            }}
            defaultValue={"credit"}
            onChange={(value) => {
              if (value)
                form.setFieldValue(
                  "payment_type",
                  value as "credit" | "debit" | "paypal" | "bank"
                );
              else form.setFieldValue("payment_type", "credit");
            }}
            required
            data={[
              { value: "credit", label: "Credit" },
              { value: "debit", label: "Debit" },
              { value: "paypal", label: "Paypal" },
              { value: "bank", label: "Bank" },
            ]}
            error={form.errors.payment_type}
          />
          <TextInput
            label="Card Number"
            name="card_number"
            description="For security problem, I'd prefer you to select one in FAQ Box"
            placeholder="4539 1488 0343 6467"
            value={form.values.card_number}
            styles={{
              label: {
                fontSize: "0.8rem",
                color: "grey",
              },
            }}
            onChange={handleChange}
            required
            error={form.errors.card_number}
          />
          <DateInput
            label="Expire"
            name="expire"
            renderDay={(date) => {
              const day = date.getDate();
              const month = date.getMonth();
              const year = date.getFullYear();
              return (
                <Indicator
                  processing
                  size={6}
                  color="blue"
                  offset={-5}
                  disabled={
                    day !== new Date().getDate() ||
                    month !== new Date().getMonth() ||
                    year !== new Date().getFullYear()
                  }
                >
                  <div>{day}</div>
                </Indicator>
              );
            }}
            styles={{
              label: {
                fontSize: "0.8rem",
                color: "grey",
              },
            }}
            allowDeselect
            valueFormat={`Ngày D MMMM, YYYY`}
            value={form.values.expire as Date}
            onChange={(value) => form.setFieldValue("expire", value as Date)}
            error={form.errors.expire}
            popoverProps={{
              styles: {
                dropdown: {
                  scale: "0.9",
                  left: "0px !important",
                  top: "0px !important",
                },
              },
            }}
            required
          />
          <Group position="apart">
            <Checkbox
              name="idDefaultPayment"
              label="Chọn làm mặc định"
              checked={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(e.target.checked)
              }
            />
            <Button type="submit" variant="light">
              Save
            </Button>
          </Group>
        </form>
      </Modal>
      {children}
    </ModalAddPaymentContext.Provider>
  );
}

export default PaymentProvider;
