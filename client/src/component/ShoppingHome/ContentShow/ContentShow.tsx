import BoxTool from "../BoxTool/BoxTool";
import ShoppingContent from "../shoppingContent/shoppingContent";
import { Stack, Group } from "@mantine/core";
function ContentShow() {
  return (
    <Stack>
      <BoxTool />

      <ShoppingContent />
    </Stack>
  );
}

export default ContentShow;
