import { upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useUrlSearchParams } from "../../hook/useCheckUrl";
import { Form } from "react-router-dom";
import { toast } from "../../toast/toast";
import PasswordRequirement from "./passwordRequirementPop/passwordRequire";
import { Popover, Progress } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { useObjectActionReturn } from "../../hook/useObjectActionReturn";
import { Container, Group, Button, Stack, PasswordInput } from "@mantine/core";
import { useStyles } from "./styleGlobal";
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
function ChangePassWord() {
  useEffect(() => {
    document.title = "Change password";
  }, []);
  const { isValidUrl, id, token } = useUrlSearchParams();
  console.log(isValidUrl, id, token);
  const { classes } = useStyles();
  const [popoverOpened, setPopoverOpened] = useState(false);
  const { isActionReturned, handleSetisActionReturned, objectAction } =
    useObjectActionReturn();
  const form = useForm({
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    validate: {
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
    if (objectAction.err) {
      toast(
        objectAction.err.message,
        true,
        "ChangePassword",
        "Lỗi",
        handleSetisActionReturned
      );
    }
  }, [handleSetisActionReturned, isActionReturned, objectAction?.err]);
  return (
    <div className={classes.mainSection}>
      <Container size={800} className={classes.Container}>
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
                    form.setFieldValue("password", event.currentTarget.value)
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
                form.setFieldValue("passwordConfirm", event.currentTarget.value)
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
            <input type="hidden" name="user_id" value={id ? id : ""} />
            <input type="hidden" name="token" value={token ? token : ""} />
          </Stack>
          <Group position="apart" mt="xl">
            <Button type="submit" radius="xl">
              {upperFirst("Save")}
            </Button>
          </Group>
        </Form>
      </Container>
    </div>
  );
}
export default ChangePassWord;
