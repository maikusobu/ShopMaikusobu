import { upperFirst } from "@mantine/hooks";
import FacebookIcon from "../socialButton/FacebookIcon";
import { useNavigate, useNavigation } from "react-router-dom";
import GoogleIcon from "../socialButton/GoogleIcon";
import { useForm } from "@mantine/form";
import { Helmet } from "react-helmet";
import { Form } from "react-router-dom";
import { useObjectError } from "../../hook/useObjectError";
import { IconX } from "@tabler/icons-react";
import { Notification, LoadingOverlay } from "@mantine/core";
import { useStyles } from "./styleGlobal";
import {
  TextInput,
  PasswordInput,
  Text,
  Container,
  Group,
  Button,
  Divider,
  Anchor,
  Stack,
  Center,
  rem,
  createStyles,
} from "@mantine/core";
function Login() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { errorAppear, handleSetErrorAppear, objectError } = useObjectError();
  console.log(objectError);
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });
  return (
    <div className={classes.mainSection}>
      <Helmet>
        <title>Login | ShopMaikusobu</title>
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
        <Center>
          <Text fz="xl" weight={700}>
            Welcome to{" "}
            <Text
              variant="gradient"
              span={true}
              gradient={{
                from: "brandcolorRed.0",
                to: "brandcolorYellow.0",
                deg: 45,
              }}
            >
              ShopMaikusobu
            </Text>
          </Text>
        </Center>
        <Divider
          label="Đăng nhập"
          labelPosition="center"
          styles={{
            label: {
              fontSize: "15px",
              fontWeight: "bold",
            },
          }}
        />

        <Group mt="md" position="center">
          <GoogleIcon radius="md" className={classes.button}>
            Google
          </GoogleIcon>
          <FacebookIcon radius="md" className={classes.button}>
            Facebook
          </FacebookIcon>
        </Group>
        <Divider
          label="Hoặc đăng nhập bằng tài khoảng"
          labelPosition="center"
          my="xs"
          styles={{
            label: {
              fontSize: "12px",
              fontWeight: "bold",
            },
          }}
        />
        <LoadingOverlay
          visible={navigation.state !== "idle"}
          loaderProps={{ size: "sm" }}
          overlayColor="#ffffff"
          radius={"10px"}
        />
        <Form action="" method="post">
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

            <PasswordInput
              required
              label="Password"
              name="password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              styles={{
                label: {
                  color: "grey",
                },
              }}
              radius="md"
            />
          </Stack>
          <Group position="apart" mt="xl">
            <Stack>
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                style={{
                  color: "black",
                  textAlign: "left",
                }}
                size="xs"
                onClick={() => {
                  navigate("/authen/signup");
                }}
              >
                {"Không có tài khoảng? Đăng ký"}
              </Anchor>
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                style={{
                  color: "black",
                }}
                size="xs"
                onClick={() => {
                  navigate("/authen/forgotpassword");
                }}
              >
                {"Quên mật khẩu? Quên mật khẩu"}
              </Anchor>
            </Stack>
            <Button type="submit" radius="xl">
              {upperFirst("Login")}
            </Button>
          </Group>
        </Form>
      </Container>
    </div>
  );
}
export default Login;
