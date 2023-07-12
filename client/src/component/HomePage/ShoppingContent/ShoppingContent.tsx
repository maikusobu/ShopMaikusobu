import { useGetTrendingProductQuery } from "../../../api/ProductReducer/ProductApi";
import {
  createStyles,
  Grid,
  Box,
  Card,
  Image,
  Group,
  Text,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { IconShoppingCartPlus } from "@tabler/icons-react";
const useStyles = createStyles(() => ({
  root: {
    paddingTop: "3rem",
  },
  BoxRoot: {
    transition: "transform 0.4s ease-in-out",
    "&:hover": {
      cursor: "pointer",
      scale: "1.1",
      transform: "translateY(-5px)",
    },
  },
}));
function ShoppingContent() {
  const { classes } = useStyles();
  const { data, error, isLoading } = useGetTrendingProductQuery();
  if (isLoading) return <p>Loading...</p>;
  if (error)
    if ("status" in error)
      return (
        <p>
          Error: {error.status} {JSON.stringify(error.data)}{" "}
        </p>
      );
  return (
    <div className={classes.root}>
      <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={45} columns={15}>
        {data?.map((product) => (
          <Grid.Col span={3} key={product.id}>
            <Box className={classes.BoxRoot}>
              <Card
                style={{
                  padding: "9px",
                }}
              >
                <Card.Section>
                  <Image src={product.image[0]} alt={product.name} />
                </Card.Section>

                <Text
                  weight={900}
                  fz={18}
                  sx={{
                    marginTop: "1rem",
                    height: "2rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  {product.name}
                </Text>

                <div>
                  <Stack spacing={4} mt="xs">
                    <Text underline>Số lượng đã bán:</Text>
                    {product.amountPurchased}
                  </Stack>
                </div>
                <Group position="left" spacing={50}>
                  <Text size={25} weight={700}>
                    ${product.price}
                  </Text>
                  <ActionIcon>
                    <IconShoppingCartPlus />
                  </ActionIcon>
                </Group>
              </Card>
            </Box>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}

export default ShoppingContent;
