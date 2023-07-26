import { Header, Group } from "@mantine/core";
import Search from "../../Search/Search";
import UserIn from "../../user/user";
function HeaderShopping() {
  return (
    <Group>
      <Search />
      <UserIn />
    </Group>
  );
}

export default HeaderShopping;
