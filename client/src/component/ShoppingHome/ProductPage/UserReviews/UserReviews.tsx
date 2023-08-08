import { useGetReviewProductQuery } from "../../../../api/ProductReducer/ProductApi";
import UserReviewDetail from "./UserReviewDetail";
import { Box, Title, Stack, Group, Text, Rating } from "@mantine/core";
function UserReviews({ product_id }: { product_id: string }) {
  const { data: reviews, error } = useGetReviewProductQuery(product_id, {
    skip: !product_id,
  });

  return (
    <Box>
      <Title order={3}>Review</Title>
      <Stack h="400px">
        {reviews?.map((review) => (
          <Box key={review._id}>
            <UserReviewDetail
              user={review.user_id}
              product_id={product_id}
              id_rating={review._id}
              reactionValue={review.reactionScore}
            />
            <Box>
              <Group>
                <Text>{review.user_rating.review}</Text>
                <Group>
                  <Text>
                    Đánh giá
                    {review.user_rating.rating_value}
                  </Text>
                  <Rating
                    value={review.user_rating.rating_value}
                    readOnly
                    size="lg"
                  />
                </Group>
              </Group>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default UserReviews;
