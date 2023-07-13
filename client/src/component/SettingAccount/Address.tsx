import React, { ChangeEvent, FormEvent } from "react";
import {
  TextInput,
  Select,
  Button,
  Group,
  createStyles,
  Stack,
} from "@mantine/core";

interface Address {
  address_line1: string;
  address_line2?: string;
  city: string;
  country: string;
}
const useStyles = createStyles((theme) => ({
  form: {
    width: "50%",
  },
}));
const UserAddressForm = () => {
  const [address, setAddress] = React.useState<Address>({
    address_line1: "",
    address_line2: "",
    city: "",

    country: "VN",
  });
  const { classes } = useStyles();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // submit the address data
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Stack>
        <TextInput
          label="Address Line 1"
          name="address_line1"
          value={address.address_line1}
          onChange={handleInputChange}
          required
        />
        <TextInput
          label="Address Line 2"
          name="address_line2"
          value={address.address_line2}
          onChange={handleInputChange}
        />

        <Group grow>
          <TextInput
            label="City"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Country"
            name="country"
            value={address.country}
            data={[{ value: "VN", label: "Vietnam" }]}
          />
        </Group>
      </Stack>
      <Button type="submit" variant="light">
        Submit
      </Button>
    </form>
  );
};
export default UserAddressForm;
