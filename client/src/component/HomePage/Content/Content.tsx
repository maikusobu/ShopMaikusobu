import CarouselBanner from "../Banner/Carousel";
import { createStyles, Group } from "@mantine/core";
import GroupButton from "../GroupButton/GroupButton";
import ContentProp from "../ContentProp/ContentProp";
const useStyles = createStyles(() => ({
  root: {
    margin: 0,
    height: "400px",
    padding: 0,

    paddingInlineEnd: "2rem",
    paddingInlineStart: "2rem",
    position: "relative",

    zIndex: 1,
  },
  CarousalContainer: {
    margin: 0,
    padding: 0,
    height: "350px",
    width: "100%",
    zIndex: 1,
    background: "transparent",
    backdropFilter: "blur(100px)",
    position: "relative",
  },
  ContentProp: {
    padding: 0,
    paddingRight: "3rem",
    paddingLeft: "3rem",
  },
}));
function Content() {
  const { classes } = useStyles();
  return (
    <>
      <div className={classes.root}>
        <div className="blob"></div>
        <Group
          className={classes.CarousalContainer}
          position="center"
          spacing={20}
        >
          <CarouselBanner />
          <GroupButton />
        </Group>
        <div className={classes.ContentProp}>
          <ContentProp />
        </div>
      </div>
    </>
  );
}

export default Content;
