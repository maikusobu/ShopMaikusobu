import { useEffect } from "react";
import ButtonAutehn from "../ButtonAuthen/ButtonAuthen";
import { createStyles, Container, Group, Autocomplete } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import { Login } from "../../../api/AuthReducer/AuthReduce";
import { Helmet } from "react-helmet";
import User from "../user/user";
import Logo from "../logo/logo";
export type UserInterface = {
  id?: string;
  username?: string;
};
const useStyles = createStyles((theme) => ({
  user: {
    width: "215px",
    padding: 0,
    display: "flex",
    justifyContent: "flex-end",
    gap: "45px",
    transform: "translateX(-40px)",
  },
  mainSection: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 0,
    margin: 0,

    minWidth: "100vw",
    width: "100%",
  },
  search: {
    flexGrow: 0.5,
    borderRadius: "20px !important",
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  group: {
    width: "100%",
  },
}));
import { IconSearch } from "@tabler/icons-react";
function Header() {
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  useEffect(() => {
    const username = localStorage.getItem("username");
    const id = localStorage.getItem("id");
    const expiresAt = localStorage.getItem("expires");
    if (username && id && expiresAt && !auth.isLoggedIn) {
      console.log(username, id, expiresAt, Date.now());
      dispatch(
        Login({
          username,
          id,
          expiresAt: Number(expiresAt),
        })
      );
    }
  }, [dispatch, auth.isLoggedIn]);
  console.log(auth);
  return (
    <Container className={classes.mainSection}>
      <Group position="apart" align="center" className={classes.group}>
        <Logo />
        <Autocomplete
          styles={{
            input: {
              borderRadius: "20px !important",
            },
          }}
          className={classes.search}
          placeholder="Search "
          icon={<IconSearch size="1rem" stroke={2} />}
          data={[
            { value: "TV", group: "Bạn vừa search" },
            { value: "Tủ lạnh", group: "Bạn vừa search" },
            { value: "Beth", group: "Xu hướng" },
            { value: "Summer", group: "Xu hướng" },
          ]}
        />
        <Container mx={0} className={classes.user}>
          {!auth.isLoggedIn ? <ButtonAutehn /> : <User {...auth} />}
        </Container>
      </Group>
    </Container>
  );
}
export default Header;
