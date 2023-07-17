import {
  createStyles,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  rem,
  Box,
} from "@mantine/core";
import {
  IconLogout,
  IconSettings,
  IconTrash,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";

import { Logout } from "../../api/AuthReducer/AuthReduce";
import { useGetUserByIdQuery } from "../../api/UserApi/UserApi";
import useAvatar from "../../hook/useAvatar";
const useStyles = createStyles((theme) => ({
  MenuFlex: {
    justifyContent: "space-between",
  },
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));
function UserIn() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = useStyles();
  const auth = useAppSelector(selectAuth);
  const { data } = useGetUserByIdQuery(auth.id, { skip: !auth.isLoggedIn });
  const imageUrl = useAvatar(data ? data : null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <Menu
      width={240}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          p={0}
          className={cx(classes.user, {
            [classes.userActive]: userMenuOpened,
          })}
        >
          <Group
            spacing={5}
            noWrap
            style={{
              overflow: "hidden",
            }}
          >
            <Avatar
              src={imageUrl}
              alt={data ? data.username : ""}
              radius="xl"
              size={30}
            />
            <Box w={70}>
              <Text
                weight={500}
                size="sm"
                sx={{ lineHeight: 1 }}
                mr={3}
                truncate
              >
                {data ? data.username : ""}
              </Text>
            </Box>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label style={{ fontSize: rem(15), fontWeight: 500 }}>
          Settings
        </Menu.Label>
        <Menu.Item
          icon={<IconSettings size="0.9rem" stroke={1.5} />}
          onClick={() => {
            navigate("settingaccount");
          }}
        >
          Account settings
        </Menu.Item>
        <Menu.Item icon={<IconSwitchHorizontal size="0.9rem" stroke={1.5} />}>
          Change account
        </Menu.Item>
        <Menu.Item
          icon={<IconLogout size="0.9rem" stroke={1.5} />}
          onClick={() => {
            dispatch(Logout());
          }}
        >
          Logout
        </Menu.Item>

        <Menu.Item color="red" icon={<IconTrash size="0.9rem" stroke={1.5} />}>
          Delete account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserIn;
