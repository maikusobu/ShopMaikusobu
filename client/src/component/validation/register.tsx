import { useState, useEffect, useContext } from "react";
import { useObjectError } from "../../hook/useObjectError";
import { upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Form } from "react-router-dom";
import {
  IconUserCheck,
  IconMailOpened,
  IconShieldCheck,
  IconCircleCheck,
} from "@tabler/icons-react";
import { SocialContext } from "../SocialContext/SocialContextProvider";
import { useStyles } from "./styleGlobal";
import { useNavigation, useNavigate } from "react-router-dom";
import PasswordRequirement from "./passwordRequirementPop/passwordRequire";
import { LoadingOverlay } from "@mantine/core";
import { Notification, PinInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
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
const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
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
  useEffect(() => {
    document.title = "Sign up";
  }, []);
  const { data } = useContext(SocialContext);
  const { classes } = useStyles();
  const [active, setActive] = useState(0);
  const { errorAppear, handleSetErrorAppear, objectError } = useObjectError();
  console.log(active);
  const handleVerification = async () => {
    if (numberConfirm.length < 6) return;
    try {
      const dataSent = await fetch(
        `${import.meta.env.VITE_SERVER}/authen/verify`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: objectError.error.id,
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
      console.log(dataSentJson);
      setActive((prev) => prev + 1);
      setTimeout(() => {
        if (objectError.error.social === true) navigate("/");
        else navigate("/authen/login");
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  };
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [popoverOpened, setPopoverOpened] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-debugger
  const [numberConfirm, setNumberConfirm] = useState("");
  const form = useForm({
    initialValues: {
      username: objectError?.data?.username || "",
      email: data?.email || objectError?.data?.email || "",
      first_name: data?.given_name || objectError?.data?.first_name || "",
      last_name: data?.family_name || objectError?.data?.last_name || "",
      password: objectError?.data?.password || "",
      passwordConfirm: "",
    },
    validate: {
      username: (val) =>
        val.length >= 1 && /^[a-zA-Z0-9]+$/i.test(val)
          ? null
          : "Username chỉ chứa duy nhất là những bản chữ cái và số",
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
    if (errorAppear) {
      if (objectError.error.status === 201) {
        setActive((prev) => prev + 1);
      }
    }
  }, [errorAppear, objectError]);
  return (
    <div className={classes.mainSection}>
      {errorAppear && objectError?.error.status !== 201 && (
        <Notification
          icon={<IconX size="1.1rem" />}
          color="red"
          onClose={() => {
            handleSetErrorAppear();
          }}
          withCloseButton={true}
          title="Lỗi 
          "
          className={classes.errorNotifi}
        >
          {objectError?.error
            ? `Lỗi xảy ra ở ${objectError?.error.field} : ${objectError?.error.message}`
            : "Lỗi khi tạo tài khoảng vui lòng nhập lại"}
        </Notification>
      )}
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
                <Group>
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
                      label="Includes at least 6 characters"
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
                <input type="hidden" value={data?.picture} name="picture" />
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
                  {"Already have an account? Login"}
                </Anchor>
                <Button type="submit" radius="xl">
                  {upperFirst("Register")}
                </Button>
              </Group>
            </Form>
          </Stepper.Step>
          <Stepper.Step
            description="Verify email"
            icon={<IconMailOpened size="1.1rem" />}
          >
            <Stack>
              <Text>Bạn hãy kiểm tra mail để được xác nhận tài khoảng!!</Text>
              <Group position="center">
                <PinInput
                  type="number"
                  length={6}
                  value={numberConfirm}
                  onChange={setNumberConfirm}
                  oneTimeCode
                  onComplete={handleVerification}
                />
              </Group>
              <Button type="button" onClick={handleVerification}>
                Xác thực
              </Button>
            </Stack>
          </Stepper.Step>
          <Stepper.Step
            description="get full access"
            icon={<IconShieldCheck size="1.1rem" />}
          >
            <Stack>
              <Text>
                Chúc mừng bạn đã xác thực thành công, bạn sẽ được trả về trang
                chủ sau ít phút
              </Text>
            </Stack>
          </Stepper.Step>
        </Stepper>
      </Container>
    </div>
  );
}
export default Register;
