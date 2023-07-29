import React from "react";

type PropType = {
  selected: boolean;
  imgSrc: string;
  index: number;
  onClick: () => void;
};
import { Box, BackgroundImage, createStyles } from "@mantine/core";
const useStyles = createStyles(() => ({
  slideButton: {
    WebkitAppearance: "none",
    backgroundColor: "transparent",
    touchAction: "manipulation",
    display: "block",
    textDecoration: "none",
    cursor: "pointer",
    border: 0,
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100%",

    transition: "opacity 0.2s",
  },
}));

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imgSrc, onClick } = props;
  const { classes } = useStyles();
  return (
    <Box
      sx={{
        flex: "0 0 28%",
        minWidth: 0,
        position: "relative",
        height: "70px",
        border: selected ? "2px solid red" : "2px solid black",
      }}
    >
      <BackgroundImage
        component="button"
        src={imgSrc}
        onClick={() => {
          onClick();
        }}
        className={classes.slideButton}
      />
    </Box>
  );
};
