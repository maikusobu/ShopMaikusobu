import { Tabs } from "@mantine/core";
import ShoppingContent from "../ShoppingContent/ShoppingContent";
import ReviewsContent from "../ReviewsContent/ReviewsContent";
import { createStyles } from "@mantine/core";
import { IconCircleArrowDownFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
        <Tabs.Tab value="social">Reviews</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="commercial">
        <ShoppingContent />
      </Tabs.Panel>
      <Tabs.Panel value="social">
        <ReviewsContent />
      </Tabs.Panel>
      <IconCircleArrowDownFilled
        className="continue-icon"
        size={40}
        onClick={() => navigate("/shopping/products/all?page=1")}
      />
      <div className={classes.overlay}></div>
    </Tabs>
  );
}

export default ContentTab;
