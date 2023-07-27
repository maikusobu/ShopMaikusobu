import {
  Box,
  Group,
  MultiSelect,
  Select,
  SegmentedControl,
  createStyles,
  Stack,
} from "@mantine/core";
import { useState } from "react";
const departments = [
  "Books",
  "Movies",
  "Music",
  "Games",
  "Electronics",
  "Computers",
  "Home",
  "Garden",
  "Tools",
  "Grocery",
  "Health",
  "Beauty",
  "Toys",
  "Kids",
  "Baby",
  "Clothing",
  "Shoes",
  "Jewelry",
  "Sports",
  "Outdoors",
  "Automotive",
  "Industrial",
];
const filters = [
  {
    label: "Hiện hành",
    value: "relevant",
  },
  {
    label: "Mua nhiều",
    value: "popular",
  },
  {
    label: "Mới nhất",
    value: "newest",
  },
];
const selection = [
  {
    label: "Giá cao tới thấp",
    value: "highest",
  },
  {
    label: "Giá thấp tới cao",
    value: "lowest",
  },
];
const useStyles = createStyles(() => ({
  boxRoot: {
    // padding: "25px",
  },
}));
function BoxTool() {
  const { classes } = useStyles();
  const [segmentedValue, setSegmentedValue] = useState("relevant");
  return (
    <Box className={classes.boxRoot} px={"20px"}>
      <Stack spacing={"25px"}>
        <MultiSelect
          data={departments}
          searchable
          placeholder="Lọc loại sản phẩm"
          nothingFound="Bạn hãy thử 1 từ khóa khác đi"
          radius={"20px"}
          clearButtonProps={{ "aria-label": "Clear selection" }}
          clearable
        />
        <Group>
          <SegmentedControl
            data={filters}
            value={segmentedValue}
            onChange={setSegmentedValue}
          />

          <Select data={selection} placeholder="Giá" clearable />
        </Group>
      </Stack>
    </Box>
  );
}

export default BoxTool;
