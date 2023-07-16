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
import { useNavigate } from "react-router-dom";
import type { UserInterface } from "../header/header";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import CartHover from "../CartHover/CartHover";
import { Logout } from "../../../api/AuthReducer/AuthReduce";
import { useGetUserByIdQuery } from "../../../api/UserApi/UserApi";
import useAvatar from "../../../hook/useAvatar";
const useStyles = createStyles((theme) => ({
  IconContainer: {
    width: rem(60),
    height: rem(40),
    display: "flex",
    justifyContent: "center",
    padding: "2px 4px",
    alignItems: "center",
    cursor: "pointer",
    border: "5px solid whtie !important",
  },
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
function UserIn({ id }: UserInterface) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, theme, cx } = useStyles();
  // const { isHovered, ref, handleMouseEnter, handleMouseLeave } = useHoverRef();
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const { data } = useGetUserByIdQuery(id as string);
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
      <Group spacing={20} position="left" noWrap>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={classes.IconContainer}
        >
          <IconGardenCart size="2rem" stroke={1.5} />
        </div>
        <IconMessage size="1.25rem" color={theme.colors.blue[6]} stroke={1.5} />
      </Group>
      {
        <CartHover
          isHovered={isHovered}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      }
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
