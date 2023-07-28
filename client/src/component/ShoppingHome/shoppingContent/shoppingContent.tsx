import {
  Box,
  Card,
  Grid,
  Indicator,
  Image,
  Text,
  Group,
  Stack,
  createStyles,
  Pagination,
  Skeleton,
} from "@mantine/core";

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProductQuery } from "../../../api/ProductReducer/ProductApi";
import { MathFunction } from "../../../Helper/MathFunction";
const useStyles = createStyles(() => ({
  root: {
    width: "100%",

    padding: "30px",
  },
  BoxRoot: {
    transition: "transform 2s ease-in-out",
    "&:hover": {
      cursor: "pointer",
      scale: "1.3",
      transform: "translateY(-5px)",
    },
  },
  BoxRoot2: {
    height: "200px",
  },
}));

function ShoppingContent({
  sort,
  categories,
  page,
  setPage,
}: {
  sort: "relevant" | "lowestprice" | "highestprice" | "popular" | "newest";
  categories: string[];
  page: number;
  setPage: (page: number) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { classes } = useStyles();

  const { data, isFetching } = useGetAllProductQuery(
    {
      page: searchParams.get("page") ? searchParams.get("page") : page,
      sort: sort,
      categories: categories,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <Box className={classes.root} pos="relative">
      <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={35} columns={18}>
        {data?.products.map((product) => (
          <Grid.Col span={3} key={product._id} id={product._id}>
            <Skeleton visible={isFetching}>
              <Indicator
                size={16}
                offset={12}
                position="top-end"
                styles={(theme) => ({
                  indicator: {
                    top: "6px !important",
                    backgroundColor: theme.colors.brandcolorRed[0],
                  },
                })}
                disabled={
                  !product.discount_id?.active || isFetching ? true : false
                }
                label="Sale off"
              >
                <Box id={product._id}>
                  <Card
                    style={{
                      padding: "9px",
                    }}
                  >
                    <Card.Section
                      style={{
                        overflow: "hidden",
                        height: "130px",
                      }}
                    >
                      <Image
                        src={product.image[0]}
                        alt={product.name}
                        className={classes.BoxRoot}
                      />
                    </Card.Section>

                    <Text
                      weight={300}
                      fz={13}
                      sx={{
                        marginTop: "1rem",
                        height: "2rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {product.name}
                    </Text>
                    <Group>
                      <Text
                        size={13}
                        weight={500}
                        strikethrough={
                          product.discount_id?.active ? true : false
                        }
                      >
                        ${product.price}
                      </Text>
                      {product.discount_id?.active && (
                        <Text size={13} weight={400}>
                          {" "}
                          $
                          {
                            MathFunction(
                              product.price as number,
                              product.discount_id?.discount_percent ?? 1
                            ) as number
                          }
                        </Text>
                      )}
                    </Group>

                    <div>
                      <Stack spacing={4}>
                        <Text underline size={13}>
                          Số lượng đã bán:
                        </Text>
                        <Text size={13} weight={500}>
                          {product.amountPurchased}
                        </Text>
                      </Stack>
                    </div>
                  </Card>
                </Box>
              </Indicator>
            </Skeleton>
          </Grid.Col>
        ))}
      </Grid>
      <Pagination
        total={data?.total ? data.total / 36 : 0}
        mt="md"
        value={page}
        boundaries={2}
        siblings={2}
        styles={(theme) => ({
          control: {
            "&[data-active]": {
              backgroundImage: theme.fn.gradient({
                from: `${theme.colors.brandcolorRed[0]}`,
                to: `${theme.colors.brandcolorYellow[0]}`,
              }),
              border: 0,
              color: theme.colors.dark[5],
            },
          },
        })}
        onChange={(value) => {
          window.scrollTo(0, 0);
          setPage(value);
          searchParams.set("page", value.toString());
          setSearchParams(searchParams);
        }}
      />
    </Box>
  );
}

export default ShoppingContent;
