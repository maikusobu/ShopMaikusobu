import { upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Helmet } from "react-helmet";
import { Form } from "react-router-dom";
import { useObjectError } from "../../hook/useObjectError";
import { IconX } from "@tabler/icons-react";
import { Notification } from "@mantine/core";
import { useStyles } from "./styleGlobal";
import React from "react";
import {
  TextInput,
  Container,
  Group,
  Button,
  Title,
  Stack,
} from "@mantine/core";

function RestorePassword() {
  const { classes } = useStyles();
  const { errorAppear, handleSetErrorAppear, objectError } = useObjectError();
  console.log(objectError);
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
    },
    validate: {
      email: (val) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)
          ? null
          : "Invalid email",
    },
  });
  return (
    <div className={classes.mainSection}>
      <Helmet>
        <title>Forgot Password | ShopMaikusobu</title>
      </Helmet>
      {errorAppear && (
        <Notification
          icon={<IconX size="1.1rem" />}
          color="red"
          onClose={() => {
            handleSetErrorAppear();
          }}
          withCloseButton={true}
          title="Lỗi"
          className={classes.errorNotifi}
        >
          {objectError.err.message}
        </Notification>
      )}
      <Container size={800} className={classes.Container}>
        <Title underline order={5}>
          Nhập thông tin xác thực để thay đổi mật khẩu
        </Title>
        <Form
          action=""
          method="post"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            if (!form.isValid()) {
              form.validate();
              event.preventDefault();
            }
          }}
        >
          <Stack>
            <TextInput
              required
              label="Username"
              placeholder="Your username"
              name="username"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
              styles={{
                label: {
                  color: "grey",
                },
              }}
              radius="md"
            />
            <TextInput
              required
              label="Email"
              placeholder="Your email"
              name="email"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              styles={{
                label: {
                  color: "grey",
                },
              }}
              radius="md"
              error={form.errors.email}
            />
          </Stack>
          <Group position="apart" mt="xl">
            <Button type="submit" radius="xl">
              {upperFirst("Next")}
            </Button>
          </Group>
        </Form>
      </Container>
    </div>
  );
}
export default RestorePassword;
