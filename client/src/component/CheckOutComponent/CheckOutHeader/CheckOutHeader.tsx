import Logo from "../../logo/logo";
import Search from "../../Search/Search";
import UserIn from "../../user/user";
import { Group, createStyles, Text } from "@mantine/core";
import { useNavigate } from "react-router";
const useStyles = createStyles(() => ({
  header: {
    height: "50px",
    width: "1px",
    backgroundColor: "white",
  },
  search: {
    flex: 0.8,
  },
}));
function CheckOutHeader() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  return (
    <Group noWrap position="apart" p="lg" style={{ width: "100%" }}>
      <Group
        noWrap
        spacing={10}
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }}
      >
        <Logo width={50} height={50} />
        <span className={classes.header}></span>
        <Text color="white" weight={700} size="lg">
          CheckOut
        </Text>
      </Group>
      <Search className={classes.search} />
      <UserIn />
    </Group>
  );
}

export default CheckOutHeader;
