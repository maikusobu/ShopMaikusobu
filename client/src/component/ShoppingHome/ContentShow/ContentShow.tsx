import BoxTool from "../BoxTool/BoxTool";
import ShoppingContent from "../shoppingContent/shoppingContent";
import { Stack, Group } from "@mantine/core";
import { useState } from "react";
function ContentShow() {
  const [sort, setSort] = useState<
    "relevant" | "lowestprice" | "highestprice" | "popular" | "newest"
  >("relevant");
  const [categories, setCategories] = useState([] as string[]);
  return (
    <Stack>
      <BoxTool
        sort={sort}
        setSort={setSort}
        categories={categories}
        setCategories={setCategories}
      />
      <ShoppingContent sort={sort} categories={categories} />
    </Stack>
  );
}

export default ContentShow;
