import { useEffect } from "react";
import ButtonAutehn from "../ButtonAuthen/ButtonAuthen";
import { createStyles, Container, Group, Autocomplete } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import { Login } from "../../../api/AuthReducer/AuthReduce";
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
    gap: "20px",
  },
  mainSection: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    margin: 0,
    minWidth: "100vw",
    width: "100%",
  },
  search: {
    flexGrow: 0.9,
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
          className={classes.search}
          placeholder="Search"
          icon={<IconSearch size="1rem" stroke={1.5} />}
          data={[
            "React",
            "Angular",
            "Vue",
            "Next.js",
            "Riot.js",
            "Svelte",
            "Blitz.js",
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
