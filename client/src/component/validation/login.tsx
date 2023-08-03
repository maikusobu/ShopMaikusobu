import { useEffect, useState, useContext } from "react";
import { upperFirst } from "@mantine/hooks";
import FacebookIcon from "../socialButton/FacebookIcon";
import { useNavigate, useNavigation } from "react-router-dom";
import GoogleIcon from "../socialButton/GoogleIcon";
import { useForm } from "@mantine/form";
import { Form, useSubmit } from "react-router-dom";
import { useObjectError } from "../../hook/useObjectError";

import { IconX } from "@tabler/icons-react";
import { Notification, LoadingOverlay } from "@mantine/core";
import { useStyles } from "./styleGlobal";
import { useGoogleLogin } from "@react-oauth/google";
import { SocialContext } from "../SocialContext/SocialContextProvider";
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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
function Login() {
  useEffect(() => {
    document.title = "Log in";
  }, []);
  const submit = useSubmit();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [submitLoading, setSubmitloading] = useState(false);
  const { data, setData } = useContext(SocialContext);
  const { errorAppear, handleSetErrorAppear, objectError } = useObjectError();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });
  const login = useGoogleLogin({
    onSuccess: async (coderesponse) => {
      const body = JSON.stringify({
        code: coderesponse.code,
      });
      setSubmitloading(true);
      const signals = await fetch(
        `${import.meta.env.VITE_SERVER}/authen/login?isSocialLogin=true`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          credentials: "include",
          body: body,
        }
      );
      const data = await signals.json();
      if (data.isExisted === false) {
        setData(data.user);
        navigate("/authen/signup");
        if (data.social === true) localStorage.setItem("id", data.id);
        localStorage.setItem("expires", data.expires);
        localStorage.setItem("refreshToken", data.refreshToken);
        notifications.show({
          id: "register",
          withCloseButton: false,
          onClose: () => console.log("unmounted"),
          onOpen: () => console.log("mounted"),
          autoClose: 1000,
          message: "You have successfully logined",
          color: "white",
          style: { backgroundColor: "green" },
          sx: { backgroundColor: "green" },
          loading: false,
        });
        await new Promise<void>((r) =>
          setTimeout(() => {
            r();
            setSubmitloading(false);
          }, 1000)
        );
        navigate("/");
      }
    },

    scope: "profile",
    flow: "auth-code",
  });
  return (
    <div className={classes.mainSection}>
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

        <Group mt="md" position="center" spacing={50}>
          <GoogleIcon
            radius="md"
            className={classes.buttonSocial}
            onClick={() => login()}
          >
            Google
          </GoogleIcon>
          <FacebookIcon radius="md" className={classes.buttonSocial}>
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
          visible={navigation.state !== "idle" || submitLoading}
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
