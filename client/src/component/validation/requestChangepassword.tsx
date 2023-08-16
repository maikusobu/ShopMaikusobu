import React, { useEffect } from "react";
import { upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Overlay, Text } from "@mantine/core";
import { Form } from "react-router-dom";
import { useObjectActionReturn } from "../../hook/useObjectActionReturn";

import { LoadingOverlay } from "@mantine/core";
import { useStyles } from "./styleGlobal";
import { useNavigation } from "react-router-dom";
import {
  TextInput,
  Container,
  Group,
  Button,
  Title,
  Stack,
} from "@mantine/core";
import { toast } from "../../toast/toast";

function RestorePassword() {
  useEffect(() => {
    document.title = "Forgot password";
  }, []);
  const { classes } = useStyles();
  const navigation = useNavigation();
  const { isActionReturned, handleSetisActionReturned, objectAction } =
    useObjectActionReturn();
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
  useEffect(() => {
    if (isActionReturned) {
      if (objectAction?.err) {
        toast(
          objectAction?.err.message,
          true,
          "Request changepassword",
          "Lỗi",
          handleSetisActionReturned
        );
      }
    }
  }, [handleSetisActionReturned, isActionReturned, objectAction]);
  return (
    <div className={classes.mainSection}>
      <Container size={800} className={classes.Container}>
        {objectAction?.json.status === 200 && isActionReturned && (
          <Overlay
            center
            opacity={1}
            sx={{
              backgroundColor: "white",
            }}
          >
            <Text color="black">
              Yêu cầu đổi mật khẩu của bạn đã được gửi thành công, bạn vui lòng
              kiểm tra mail, nếu không có bạn hãy thử kiểm trả cả thử mục spam,
              lưu ý: yêu cầu chỉ có thời hạn 1 giờ
            </Text>
          </Overlay>
        )}
        <LoadingOverlay visible={navigation.state !== "idle"} />
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
