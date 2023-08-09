import { useGetReviewProductQuery } from "../../../../api/ProductReducer/ProductApi";
import UserReviewDetail from "./UserReviewDetail";
import { Box, Title, Stack, Group, Text, Rating } from "@mantine/core";
import { selectAuth } from "../../../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../../../app/hooks";
function UserReviews({ product_id }: { product_id: string }) {
  const { data: reviews } = useGetReviewProductQuery(product_id, {
    skip: !product_id,
  });
  const auth = useAppSelector(selectAuth);
  const reactionValue = (reaction: {
    upvote: string[];
    downvote: string[];
  }) => {
    return reaction.upvote.length - reaction.downvote.length;
  };
  function roundToHalf(num: number) {
    return Math.round(num * 2) / 2;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isUpvote = (review: any) => {
    return review.reactionScore.upvote.includes(auth.id);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDownvote = (review: any) => {
    return review.reactionScore.downvote.includes(auth.id);
  };
  return (
    <Box>
      <Title order={3}>Review</Title>
      <Stack h="400px">
        {reviews?.map((review) => (
          <Box key={review._id} px="10px">
            <Group>
              <UserReviewDetail
                user={review.user_id}
                product_id={product_id}
                id_rating={review.reactionScore._id}
                reactionValue={reactionValue(review.reactionScore)}
                isUpvote={isUpvote(review)}
                isDownvote={isDownvote(review)}
              />
              <Rating
                value={roundToHalf(review.user_rating.rating_value)}
                readOnly
                fractions={2}
                size="sm"
              />
            </Group>
            <Box>
              <Group>
                <Text>{review.user_rating.review}</Text>
                <Group>
                  <Text>
                    Đánh giá {roundToHalf(review.user_rating.rating_value)} ⭐
                  </Text>
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
