import { Group, createStyles, Text } from "@mantine/core";
import Search from "../../Search/Search";

import UserContainerHome from "../../HomePage/UserContainerHome/UserContainerHome";
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
  return (
    <Group position="apart" p="lg">
      <Group>
        <Logo height={"40px"} width={"40px"} />
        <Text>Shopping</Text>
      </Group>
      <Search className={classes.Search} />
      <UserContainerHome />
    </Group>
  );
}

export default HeaderShopping;
