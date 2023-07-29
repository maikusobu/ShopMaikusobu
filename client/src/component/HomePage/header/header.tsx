import ButtonAutehn from "../ButtonAuthen/ButtonAuthen";
import { createStyles, Container, Group, Box } from "@mantine/core";
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
  },
  mainSection: {
    position: "relative",
    zIndex: 9999,
    paddingBottom: 0,
    margin: 0,
    minWidth: "100vw",
    paddingTop: "10px",
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
    paddingRight: "10px",
    paddingLeft: "10px",
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
        <Logo width={40} height={40} />
        <Search className={classes.search} />
        <Box mx={0} className={classes.user}>
          {!auth.isLoggedIn ? <ButtonAutehn /> : <UserContainerHome />}
        </Box>
      </Group>
    </Container>
  );
}
export default Header;
