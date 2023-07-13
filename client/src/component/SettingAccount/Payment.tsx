import React from "react";
import {
  TextInput,
  Select,
  Button,
  Title,
  createStyles,
  Indicator,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  useGetUserPaymentByIdQuery,
  useUpsertUserPaymentMutation,
} from "../../api/UserApi/UserPaymentApi";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { useEffect } from "react";
import { IsDeepEqual } from "../../Helper/IsDeepEqual";
interface UserPaymentValues {
  payment_type: "credit" | "debit" | "paypal" | "bank";
  card_number: string;
  expire: Date;
}
const useStyles = createStyles(() => ({
  formContainer: {
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
function UserPaymentForm() {
  const { classes } = useStyles();
  const auth = useAppSelector(selectAuth);
  const { data } = useGetUserPaymentByIdQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  const [upsertUserPayment, { isLoading }] = useUpsertUserPaymentMutation();

  const form = useForm<UserPaymentValues>({
    initialValues: {
      payment_type: "credit",
      card_number: "",
      expire: new Date(new Date().getDate() + 1),
    },
    validate: {
      payment_type: (v) =>
        isValidPaymentType(v) ? null : "Invalid payment type!",
      card_number: (v) =>
        isValidCardNumber(v) ? null : "Please typing the valid",
      expire: (v) => (isValidExpireDate(v) ? null : "Invalid expire date!"),
    },
    validateInputOnChange: true,
  });
  // const [values, setValues] = React.useState<UserPaymentValues>({
  //   payment_type: "",
  //   card_number: "",
  //   expire: null,
  // });
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
    console.log(value);

    form.setFieldValue(name, formatCreditCardNumber(value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("work");
    const formData = {
      user_id: auth.id,
      ...form.values,
      expire: form.values.expire.toISOString(),

      card_number: parseInt(form.values.card_number.replace(/\s/g, "")),
    };
    console.log(formData);
    upsertUserPayment(formData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    // setValues({
    //   ...values,
    //   ...form.values,
    //
  };
  // console.log(form.values.card_number);
  useEffect(() => {
    if (data) {
      form.setFieldValue("payment_type", data.payment_type);
      form.setFieldValue(
        "card_number",
        formatCreditCardNumber(data.card_number.toString())
      );
      form.setFieldValue("expire", new Date(data.expire));
      console.log(data);
    }
  }, [data]);
  return (
    <form
      className={classes.formContainer}
      onSubmit={handleSubmit}
      style={{
        border: "1px solid grey",
        width: "50%",
      }}
    >
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
        value={form.values.expire}
        onChange={(value) => form.setFieldValue("expire", value as Date)}
        error={form.errors.expire}
        required
      />
      <Button type="submit" variant="light">
        Save
      </Button>
    </form>
  );
}

export default UserPaymentForm;
