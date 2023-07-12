import { Tabs } from "@mantine/core";
import ShoppingContent from "../ShoppingContent/ShoppingContent";
import { createStyles } from "@mantine/core";
function ContentTab() {
  return (
    <Tabs
      variant="pills"
      defaultValue="commercial"
      styles={(theme) => ({
        tab: {
          fontWeight: 600,
          fontSize: "1rem",
          "&[data-active]": {
            color: theme.colors.dark[9],
            backgroundImage: `linear-gradient(45deg, ${theme.colors.brandcolorYellow[0]} , ${theme.colors.brandcolorRed[0]})`,
          },
        },
      })}
    >
      <Tabs.List
        position="left"
        style={{
          gap: "1rem",
        }}
      >
        <Tabs.Tab value="commercial">Shopping</Tabs.Tab>
        <Tabs.Tab value="social">Social</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="commercial">
        <ShoppingContent />
      </Tabs.Panel>
      <Tabs.Panel value="social">Social content</Tabs.Panel>
    </Tabs>
  );
}

export default ContentTab;
