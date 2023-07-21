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
  Indicator,
  Button,
} from "@mantine/core";
import { useContext } from "react";
import { ModalContext } from "../../ModalContext/ModalContext";
import { useAppSelector } from "../../../app/hooks";
import { MathFunction } from "../../../Helper/MathFunction";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { ErrorContext } from "../../ErrorContext/ErrorContext";
import { useCreateCartMutation } from "../../../api/CartReducer/CartApi";
import { useUpdateCartItemMutation } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
const useStyles = createStyles(() => ({
  root: {
    paddingTop: "3rem",
  },
  BoxRoot: {
    transition: "transform 2s ease-in-out",
    "&:hover": {
      cursor: "pointer",
      scale: "1.3",
      transform: "translateY(-5px)",
    },
  },
}));

function ShoppingContent() {
  const { classes } = useStyles();
  const { data, error, isLoading } = useGetTrendingProductQuery();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { open, close } = useContext(ModalContext)!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { setData, setError } = useContext(ErrorContext)!;
  const [updateCartItem] = useUpdateCartItemMutation();
  const [createCart] = useCreateCartMutation();
  const auth = useAppSelector(selectAuth);
  console.log(data);
  const handleAddCartItem = (productId: string) => {
    createCart({ product_id: productId, quantity: 1 })
      .unwrap()
      .then((res) => {
        open();
        setTimeout(() => {
          close();
        }, 2000);
        updateCartItem({ CartItemId: res.data._id, id: auth.id })
          .unwrap()
          .then(() => {
            setData("Successful");
          });
      })
      .catch((err) =>
        setError({
          message: err.message,
        })
      );
  };
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
          <Grid.Col span={3} key={product._id} id={product._id}>
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
              disabled={product.discount_id?.active ? false : true}
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
                      marginBottom: "0.2rem",
                    }}
                  >
                    {product.name}
                  </Text>
                  <Group>
                    <Text
                      size={15}
                      weight={400}
                      strikethrough={product.discount_id?.active ? true : false}
                    >
                      ${product.price}
                    </Text>
                    {product.discount_id?.active && (
                      <Text size={15} weight={400}>
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
                      <Text underline>Số lượng đã bán:</Text>
                      {product.amountPurchased}
                    </Stack>
                  </div>
                  <Group position="center" grow spacing={50} mt="10px">
                    <Button
                      variant="light"
                      leftIcon={<IconShoppingCartPlus />}
                      onClick={() => handleAddCartItem(product._id)}
                    >
                      Add Card
                    </Button>
                  </Group>
                </Card>
              </Box>
            </Indicator>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}

export default ShoppingContent;
