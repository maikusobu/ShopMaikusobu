import { Group, createStyles, Text } from "@mantine/core";
import Search from "../../Search/Search";
import ButtonAutehn from "../../HomePage/ButtonAuthen/ButtonAuthen";
import UserContainerHome from "../../HomePage/UserContainerHome/UserContainerHome";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../../app/hooks";
import Logo from "../../logo/logo";
const useStyles = createStyles(() => ({
  Search: {
    width: "600px",
  },
  // Logo: {
  //   height: "40px",
  //   width: "40px",
  // },
}));
function HeaderShopping() {
  const { classes } = useStyles();
  const auth = useAppSelector(selectAuth);
  return (
    <Group position="apart" p="lg">
      <Group>
        <Logo height={"40px"} width={"40px"} />
        <Text>Shopping</Text>
      </Group>
      <Search className={classes.Search} />
      {!auth.isLoggedIn ? <ButtonAutehn /> : <UserContainerHome />}
    </Group>
  );
}

export default HeaderShopping;
