import Logo from "../../logo/logo";
import Search from "../../Search/Search";
import UserIn from "../../user/user";
import { Group } from "@mantine/core";
function HeaderCart() {
  return (
    <Group>
      <Logo width={50} height={50} />
      <Search />
      <UserIn />
    </Group>
  );
}

export default HeaderCart;
