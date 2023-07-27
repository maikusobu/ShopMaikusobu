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
    value: "highestprice",
  },
  {
    label: "Giá thấp tới cao",
    value: "lowestprice",
  },
];
const useStyles = createStyles(() => ({
  boxRoot: {
    // padding: "25px",
  },
}));
type BoxToolProps = {
  sort: "relevant" | "lowestprice" | "highestprice" | "popular" | "newest";
  setSort: (
    value: "relevant" | "lowestprice" | "highestprice" | "popular" | "newest"
  ) => void;
  categories: string[];
  setCategories: (value: string[]) => void;
};
function BoxTool({ sort, setSort, categories, setCategories }: BoxToolProps) {
  const { classes } = useStyles();
  const [priceSort, setPriceSort] = useState<string>("");
  const [segmentedSort, setSegmentedSort] = useState<string>("relevant");
  return (
    <Box className={classes.boxRoot} px={"20px"}>
      <Stack spacing={"25px"}>
        <MultiSelect
          data={departments}
          searchable
          value={categories}
          onChange={setCategories}
          placeholder="Lọc loại sản phẩm"
          nothingFound="Bạn hãy thử 1 từ khóa khác đi"
          radius={"20px"}
          clearButtonProps={{ "aria-label": "Clear selection" }}
          clearable
        />
        <Group>
          <SegmentedControl
            data={filters}
            value={segmentedSort}
            onChange={(value) => {
              setPriceSort("");
              setSegmentedSort(value ? value : "");
              setSort(
                value
                  ? (value as
                      | "relevant"
                      | "lowestprice"
                      | "highestprice"
                      | "popular"
                      | "newest")
                  : "relevant"
              );
            }}
          />

          <Select
            data={selection}
            placeholder="Giá"
            clearable
            value={priceSort}
            onChange={(value) => {
              setPriceSort(value ? value : "");
              setSegmentedSort("");
              setSort(
                value
                  ? (value as
                      | "relevant"
                      | "lowestprice"
                      | "highestprice"
                      | "popular"
                      | "newest")
                  : "relevant"
              );
            }}
          />
        </Group>
      </Stack>
    </Box>
  );
}

export default BoxTool;
