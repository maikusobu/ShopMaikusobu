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
  IconMessage,
  IconSettings,
  IconGardenCart,
  IconCash,
  IconTrash,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import type { UserInterface } from "../header/header";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { dataURLToBlob } from "../../../Helper/UrlToObject";
import { Logout } from "../../../api/AuthReducer/AuthReduce";
import { useGetUserByIdQuery } from "../../../api/fetchUser/fetchUser";
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
function UserIn({ username, id }: UserInterface) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, theme, cx } = useStyles();
  const [imageUrl, setImageUrl] = useState("");
  const { data } = useGetUserByIdQuery(id as string);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data) {
      const blob = dataURLToBlob(data.avatar);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    }
  }, [data]);
  return (
    <Menu
      width={240}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Group spacing={8} position="left" noWrap>
        <IconCash size="1.25rem" color={theme.colors.green[6]} stroke={1.5} />
        <IconGardenCart
          size="1.25rem"
          color={theme.colors.red[6]}
          stroke={1.5}
        />
        <IconMessage size="1.25rem" color={theme.colors.blue[6]} stroke={1.5} />
      </Group>
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
            <Avatar src={imageUrl} alt={username} radius="xl" size={30} />
            <Box w={50}>
              <Text
                weight={500}
                size="sm"
                sx={{ lineHeight: 1 }}
                mr={3}
                truncate
              >
                {username}
              </Text>
            </Box>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label style={{ fontSize: rem(15), fontWeight: 500 }}>
          Settings
        </Menu.Label>
        <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
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
