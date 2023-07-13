import { Tabs } from "@mantine/core";
import ShoppingContent from "../ShoppingContent/ShoppingContent";
import { createStyles } from "@mantine/core";
import { IconCircleArrowDownFilled } from "@tabler/icons-react";
const useStyles = createStyles(() => ({
  overlay: {
    position: "relative",
    top: "15px",
    background: "white",
    filter: "blur(40px)",
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    width: "100%",
    // boxShadow: "0px -10px 100px rgba(255, 255, 255, 1)",
    height: "30px",
  },
}));
function ContentTab() {
  const { classes } = useStyles();
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
      <IconCircleArrowDownFilled className="continue-icon" size={40} />
      <div className={classes.overlay}></div>
    </Tabs>
  );
}

export default ContentTab;
