import { TextInput, Title, Group, Select, Stack } from "@mantine/core";
import { UseForm } from "@mantine/form/lib/types";
function Payment() {
  return (
    <form>
      <Title order={4}>Payment Information</Title>
      <Stack mt="lg">
        <Select
          label="Card Type"
          placeholder="Select your card"
          data={[
            { value: "credit", label: "Credit" },
            { value: "debit", label: "Debit" },
            { value: "paypal", label: "Paypal" },
            { value: "bank", label: "Bank" },
          ]}
        />
        <input />
      </Stack>
    </form>
  );
}

export default Payment;
