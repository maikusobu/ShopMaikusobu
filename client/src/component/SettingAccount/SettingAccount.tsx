import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Group,
  Tabs,
  Title,
  createStyles,
} from "@mantine/core";
import Layout from "../layout/layout";
import GeneralInfo from "./GeneralInfo";

import Payment from "./Payment";
import UserAddressForm from "./Address";

import { IconArrowBack } from "@tabler/icons-react";

const useStyles = createStyles(() => ({
  container: {
    height: "100%",
    width: "100%",
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "10px",
  },
}));
function SettingAccount() {
  useEffect(() => {
    document.title = "Settings";
  }, []);
  const { classes } = useStyles();

  const navigate = useNavigate();

  return (
    <Layout>
      <Container mx={0} className={classes.container} id="container">
        <Group>
          <Button
            leftIcon={<IconArrowBack />}
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
          <Title order={1}>Account Setting</Title>
        </Group>
        <Tabs
          orientation="vertical"
          variant="pills"
          radius="lg"
          defaultValue="generalInfo"
          styles={{
            root: {
              width: "100%",
              height: "100% !important",
              minHeight: "100vh",
              gap: "10rem",
              alignItems: "flex-start",
            },
            tabsList: {
              flexGrow: 0,
            },
          }}
        >
          <Box
            sx={{
              border: "1px solid #ccc",
              width: "200px",

              flexShrink: 0,
              flexGrow: 0,
              // transform: "translateX(-300px) translateY(50px)",
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="generalInfo">General Infomation</Tabs.Tab>

              <Tabs.Tab value="payment">Payment</Tabs.Tab>
              <Tabs.Tab value="address">Address</Tabs.Tab>
            </Tabs.List>
          </Box>
          <Box
            sx={{
              border: "1px solid #ccc",
              flexGrow: 0.6,
              padding: "1.5rem",
              flexShrink: 0,

              // transform: "translateX(-300px) translateY(50px)",
            }}
          >
            <Tabs.Panel value="generalInfo">
              <GeneralInfo />
            </Tabs.Panel>
            <Tabs.Panel value="address">
              <UserAddressForm />
            </Tabs.Panel>
            <Tabs.Panel value="payment">
              <Payment />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Container>
    </Layout>
  );
}

export default SettingAccount;
