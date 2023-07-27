import ButtonAutehn from "../ButtonAuthen/ButtonAuthen";
import { createStyles, Container, Group } from "@mantine/core";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import Search from "../../Search/Search";
import UserContainerHome from "../UserContainerHome/UserContainerHome";
import Logo from "../../logo/logo";

export type UserInterface = {
  id?: string;
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
    position: "relative",
    zIndex: 9999,
    paddingTop: theme.spacing.sm,
    paddingBottom: 0,
    margin: 0,

    minWidth: "100vw",
    width: "100%",
  },
  search: {
    width: "600PX",
    borderRadius: "20px !important",
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  group: {
    width: "100%",
    // position: "relative",
    // zIndex: 9999,
  },
}));

function Header() {
  const { classes } = useStyles();

  const auth = useAppSelector(selectAuth);
  console.log(auth);
  return (
    <Container className={classes.mainSection}>
      {/* <Helmet>
        <title>Home</title>
      </Helmet> */}
      <Group position="apart" align="center" className={classes.group}>
        <Logo
          width={40}
          height={40}
          style={{
            transform: "translateX(40px)",
          }}
        />
        <Search className={classes.search} />
        <Container mx={0} className={classes.user}>
          {!auth.isLoggedIn ? <ButtonAutehn /> : <UserContainerHome />}
        </Container>
      </Group>
    </Container>
  );
}
export default Header;
