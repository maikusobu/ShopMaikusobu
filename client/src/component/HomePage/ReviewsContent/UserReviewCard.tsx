import { Group, Box, Avatar, Anchor, Rating, Stack, Text } from "@mantine/core";
import useAvatar from "../../../hook/useAvatar";
import type { UserJson } from "../../../api/UserApi/UserApi";
import { useGetProductByIdQuery } from "../../../api/ProductReducer/ProductApi";
function UserReviewCard({
  user,
  product_id,
  review,
  ratingValue,
}: {
  user: UserJson;
  product_id: string;
  review: string;
  ratingValue: number;
}) {
  const imageUrl = useAvatar(user);
  const { data: product } = useGetProductByIdQuery(product_id, {
    skip: !product_id,
  });
  return (
    <Box>
      <Group>
        <Avatar src={imageUrl} radius="xl" />
        <Text>{user.username}</Text>
      </Group>
      <Box>
        <Stack spacing={10}>
          <Group>
            <Text size={12}> Review: </Text>
            <Anchor href={`shopping/products/${product_id}`}>
              {product?.name}
            </Anchor>
          </Group>
          <Text>{review}</Text>
        </Stack>
      </Box>
      <Box>
        <Rating value={ratingValue} readOnly fractions={2} />
      </Box>
    </Box>
  );
}

export default UserReviewCard;
