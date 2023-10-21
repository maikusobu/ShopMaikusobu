/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import { useObjectActionReturn } from "../../hook/useObjectActionReturn";
import { upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Form } from "react-router-dom";
import {
  IconUserCheck,
  IconMailOpened,
  IconCircleCheck,
} from "@tabler/icons-react";
import { SocialContext } from "../SocialContext/SocialContextProvider";
import { useStyles } from "./styleGlobal";
import { useNavigation, useNavigate } from "react-router-dom";
import PasswordRequirement from "./passwordRequirementPop/passwordRequire";
import { LoadingOverlay } from "@mantine/core";
import { PinInput } from "@mantine/core";
import {
  TextInput,
  PasswordInput,
  Text,
  Container,
  Group,
  Button,
  Anchor,
  Stack,
  Center,
  rem,
  Progress,
  Popover,
  Stepper,
} from "@mantine/core";
import { toast } from "../../toast/toast";
const requirements = [
  { re: /[0-9]/, label: "Chứa số" },
  { re: /[a-z]/, label: "Chứa kí tự thường" },
  { re: /[A-Z]/, label: "Chứa kí tự in hoa" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Chứa kí tự đặc biệt" },
];
function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function Register() {
  const { data } = useContext(SocialContext);
  const { classes } = useStyles();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const { objectAction, handleSetisActionReturned, isActionReturned } =
    useObjectActionReturn();

  const handleVerification = async () => {
    if (numberConfirm.length < 6) return;
    try {
      const dataSent = await fetch(
        `${import.meta.env.VITE_SERVER}/authen/verify`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: objectAction?.json?.id,
            numberConfirm: Number(numberConfirm),
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );
      const dataSentJson = await dataSent.json();

      setActive((prev) => prev + 1);
      toast(dataSentJson.message, false, "Verification", "Xác thực");
      setTimeout(() => {
        navigate("/authen/login");
      }, 3000);
    } catch (err: any) {
      toast(err.message, true, "Register", "Đăng ký");
    }
  };
  const handleResend = async () => {
    setLoading(true);
    setDisable(true);
    try {
      const dataSent = await fetch(
        `${import.meta.env.VITE_SERVER}/authen/resend`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: objectAction?.json?.id,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      const dataSentJson = await dataSent.json();
      setLoading(false);
      setTimeout(() => {
        setDisable(false);
      }, 5000);
      toast(dataSentJson.message, false, "Resend", "Mã xác thực");
    } catch (err: any) {
      toast(err.message, true, "Resend", "Mã xác thực");
    }
  };
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [popoverOpened, setPopoverOpened] = useState(false);

  const [numberConfirm, setNumberConfirm] = useState("");
  const form = useForm({
    initialValues: {
      username: objectAction?.data?.username || "",
      email: data?.user?.email || objectAction?.data?.email || "",
      first_name: data?.user.given_name || objectAction?.data?.first_name || "",
      last_name: data?.user.family_name || objectAction?.data?.last_name || "",
      password: objectAction?.data?.password || "",
      passwordConfirm: "",
    },
    validate: {
      username: (val) =>
        val.length >= 1 && /^[a-zA-Z0-9]+$/i.test(val)
          ? null
          : "Username chỉ chứa duy nhất là chữ cái và số",
      email: (val) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)
          ? null
          : "Email không hợp lệ",
      password: (val) =>
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{6,}$/.test(
          val
        )
          ? null
          : "Password should be more than 6 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
      passwordConfirm: (val, values) =>
        val === values.password ? null : "Passwords do not match",
    },
  });

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  const strength = getStrength(form.values.password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  useEffect(() => {
    document.title = "Sign up";
  }, []);
  console.log(objectAction);
  useEffect(() => {
    if (isActionReturned) {
      if (objectAction?.json?.status === 201) {
        setActive((prev) => prev + 1);
      }
      if (objectAction?.err) {
        toast(
          objectAction?.err.message,
          true,
          "Register",
          "Lỗi",
          handleSetisActionReturned
        );
      }
    }
  }, [isActionReturned, objectAction]);
  return (
    <div className={classes.mainSection}>
      <Container size={800} className={classes.Container}>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          completedIcon={<IconCircleCheck size="1.1rem" />}
        >
          <Stepper.Step
            description="Tạo tài khoảng"
            icon={<IconUserCheck size="1.1rem" />}
          >
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
            <LoadingOverlay
              visible={navigation.state !== "idle"}
              loaderProps={{ size: "sm" }}
              overlayColor="#ffffff"
              radius={"10px"}
            />

            <Form
              className={classes.form}
              method="post"
              action=""
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                const isValid = form.isValid();
                if (!isValid) {
                  form.validate();
                  event.preventDefault();
                }
              }}
            >
              <Stack spacing={rem(5)}>
                <Group grow>
                  <TextInput
                    label="First name"
                    placeholder="Nguyen"
                    name="first_name"
                    value={form.values.first_name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      form.setFieldValue(
                        "first_name",
                        event.currentTarget.value
                      )
                    }
                    styles={{
                      label: {
                        color: "grey",
                      },
                    }}
                    radius="md"
                  />
                  <TextInput
                    label="Last name"
                    placeholder="Hung"
                    name="last_name"
                    value={form.values.last_name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      form.setFieldValue("last_name", event.currentTarget.value)
                    }
                    styles={{
                      label: {
                        color: "grey",
                      },
                    }}
                    radius="md"
                  />
                </Group>
                <TextInput
                  required
                  label="User name"
                  name="username"
                  placeholder="username1"
                  value={form.values.username}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    form.setFieldValue("username", event.currentTarget.value)
                  }
                  styles={{
                    label: {
                      color: "grey",
                    },
                  }}
                  radius="md"
                  error={form.errors.username}
                />
                <TextInput
                  required
                  label="Email"
                  name="email"
                  placeholder="hello@gmail.com"
                  value={form.values.email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    form.setFieldValue("email", event.currentTarget.value)
                  }
                  styles={{
                    label: {
                      color: "grey",
                    },
                  }}
                  error={form.errors.email}
                  radius="md"
                />
                <Popover
                  opened={popoverOpened}
                  position="bottom"
                  width="target"
                  transitionProps={{ transition: "pop" }}
                >
                  <Popover.Target>
                    <PasswordInput
                      required
                      label="Password"
                      name="password"
                      placeholder="Your password"
                      value={form.values.password}
                      onFocusCapture={() => setPopoverOpened(true)}
                      onBlurCapture={() => setPopoverOpened(false)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        form.setFieldValue(
                          "password",
                          event.currentTarget.value
                        )
                      }
                      styles={{
                        label: {
                          color: "grey",
                        },
                        error: {
                          wordWrap: "break-word",
                          maxInlineSize: "55ch",
                        },
                      }}
                      error={form.errors.password}
                      radius="md"
                    />
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Progress color={color} value={strength} size={5} mb="xs" />
                    <PasswordRequirement
                      label="Chứa ít nhất 6 kí tự"
                      meets={form.values.password.length > 5}
                    />
                    {checks}
                  </Popover.Dropdown>
                </Popover>
                <PasswordInput
                  required
                  label="Password Confirm"
                  placeholder="Your password confirm"
                  value={form.values.passwordConfirm}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    form.setFieldValue(
                      "passwordConfirm",
                      event.currentTarget.value
                    )
                  }
                  styles={{
                    label: {
                      color: "grey",
                    },
                    error: {
                      wordWrap: "break-word",
                      maxInlineSize: "55ch",
                    },
                  }}
                  error={form.errors.passwordConfirm}
                  radius="md"
                />
                <input
                  type="hidden"
                  value={data ? data.user.picture : ""}
                  name="picture"
                />
                <input
                  type="hidden"
                  name="isSocialLogin"
                  value={String(data?.isSocialLogin ? true : false)}
                />
              </Stack>
              <Group position="apart" mt="xl">
                <Anchor
                  component="button"
                  type="button"
                  color="dimmed"
                  style={{
                    color: "black",
                  }}
                  size="xs"
                  onClick={() => {
                    navigate("/authen/login");
                  }}
                >
                  {"Đã có tài khoảng? Đăng nhập"}
                </Anchor>
                <Button type="submit" radius="xl">
                  {upperFirst("Register")}
                </Button>
              </Group>
            </Form>
          </Stepper.Step>
          <Stepper.Step
            description="Xác thực email"
            icon={<IconMailOpened size="1.1rem" />}
          >
            <Stack px="10px" w="70%" mx="auto">
              <Stack spacing={10}>
                <Text size={15} weight={700}>
                  Bạn hãy nhập mã xác nhận đã được gửi tới mail của bạn để xác
                  thực tài khoảng
                </Text>
                <Text size={12} weight={300}>
                  (lưu ý: kiểm tra ở thư mục spam nếu không thấy mail)
                </Text>
              </Stack>
              <Button
                onClick={handleResend}
                disabled={disable}
                loading={loading}
              >
                Resend
              </Button>
              <Group position="center">
                <PinInput
                  type="number"
                  length={6}
                  value={numberConfirm}
                  onChange={setNumberConfirm}
                  oneTimeCode
                />
              </Group>
              <Button type="button" onClick={handleVerification}>
                Xác thực
              </Button>
            </Stack>
          </Stepper.Step>
          <Stepper.Completed>
            <Stack>
              <Text>
                Chúc mừng bạn đã xác thực thành công, bạn sẽ được trả về trang
                chủ sau vài giây
              </Text>
            </Stack>
          </Stepper.Completed>
        </Stepper>
      </Container>
    </div>
  );
}
export default Register;
