import {
  Button,
  Image,
  Paper,
  createStyles,
  Text,
  Anchor,
  Container,
  Box,
  Center,
} from "@mantine/core";
import imageFace from "../../../assets/1553857671.svg";
import { useGetShoppingSessionQuery } from "../../../api/ShoppingSessionApi/ShoppingSessionApi";
import { selectAuth } from "../../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
const usestyles = createStyles((theme) => ({
  root: {
    boxSizing: "border-box",
    position: "absolute",
    top: "50px",
    right: "180px",
    zIndex: 999,
    minHeight: "0px",
    display: "flex",
    minWidth: "0px",
    flexDirection: "column",
    alignItems: "flex-start",
    transformOrigin: " calc(100% - 33px) 0",
    transition: "all 0.3s ease-in-out",

    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: "white",
    [theme.breakpoints.sm]: {
      padding: `${theme.spacing.md} ${theme.spacing.sm}`,
    },
    "&:after": {
      content: '""',
      position: "absolute",
      top: "-20px",
      right: "29px",

      borderWidth: "10px",
      borderStyle: "solid",
      zIndex: 99999999999,
      rotate: "180deg",
      borderColor: "white transparent transparent transparent",
    },
  },
  containerDiv: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    minHeight: "0px !important",
    minWidth: "0px !important",
    margin: 0,
  },
  ContainerUL: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  item: {
    display: "flex",
    alignItems: "center",

    transition: "all 0.1s ease-in-out",
    gap: theme.spacing.md,
  },
  image: {
    borderRadius: theme.radius.md,
    transition: "all 0.1s ease-in-out",
    objectFit: "cover",
  },
  itemContent: {
    display: "flex",

    flex: 1,
  },
  sizeColor: {
    transition: "all 0.1s ease-in-out",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[6],
  },
  quantityInput: {
    transition: "all 0.1s ease-in-out",
    height: "2rem",
    width: "3rem",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.gray[2]}`,
    backgroundColor: theme.colors.gray[5],
    padding: 0,
    textAlign: "center",
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[6],
  },
  removeButton: {
    transition: "all 0.1s ease-in-out",
    color: theme.colors.gray[6],
    // transition: "color 0.3s ease",
    // "&:hover": {
    //   color: theme.colors.red[6],
    // },
  },
  cartButton: {
    // borderRadius: theme.radius.xl,
    // padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    color: theme.colors.gray[6],
    transition: "all 0.1s ease-in-out",
    // transition: "box-shadow 0.3s ease",
    // "&:hover": {
    //   boxShadow: theme.shadows.sm,
    // },
  },
}));
interface CartHoverProps {
  isHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}
function CartHover({
  isHovered,
  handleMouseEnter,
  handleMouseLeave,
}: CartHoverProps) {
  const { classes } = usestyles();
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetShoppingSessionQuery(auth.id, {
    skip: !auth.isLoggedIn,
  });
  console.log(isFetching, isLoading);
  return (
    <Paper
      className={classes.root}
      shadow="xs"
      radius="md"
      id="container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={() => ({
        scale: isHovered ? 1 : 0,
        width: isHovered ? "30rem" : "0rem",
      })}
    >
      <Box className={classes.containerDiv}>
        {data?.cart_items.length === 0 && (
          <div>
            <Image src={imageFace} />
            <Center>
              <Text color="dark" size="lg" weight={700}>
                Your cart is empty
              </Text>
            </Center>
          </div>
        )}
        {data?.cart_items.length !== 0 && (
          <>
            <ul className={classes.ContainerUL}>
              {data?.cart_items.map((cart_item) => (
                <li className={classes.item} key={cart_item.product_id._id}>
                  <Image
                    src={cart_item.product_id.image[0]}
                    alt=""
                    className={classes.image}
                    width={40}
                    height={40}
                  />

                  <div className={classes.itemContent}>
                    <Box w={200}>
                      <Text color="dark" size="sm" weight={400} truncate>
                        {cart_item.product_id.name}
                      </Text>
                    </Box>
                    <Box
                      sx={{
                        flex: 0.6,
                      }}
                    >
                      <Text color="red" size="sm" weight={400}>
                        $
                        {(cart_item.product_id.price as number) *
                          cart_item.quantity}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="blue" size="sm" weight={400}>
                        <Text
                          component="span"
                          color="dark"
                          size="sm"
                          weight={400}
                        >
                          {" "}
                          Số lượng
                        </Text>
                        : {cart_item.quantity}
                      </Text>
                    </Box>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              color="gray"
              mt="lg"
              onClick={() => {
                navigate("/cart");
              }}
            >
              View my cart
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}

export default CartHover;
