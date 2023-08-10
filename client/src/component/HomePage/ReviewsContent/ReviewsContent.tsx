import { useGetHighestReviewQuery } from "../../../api/ProductReducer/ProductApi";
import { Box, SimpleGrid } from "@mantine/core";
import UserReviewCard from "./UserReviewCard";
function ReviewsContent() {
  const { data: reviews } = useGetHighestReviewQuery();
  function roundToHalf(num: number) {
    return Math.round(num * 2) / 2;
  }
  return (
    <Box>
      <SimpleGrid cols={4}>
        {reviews?.map((review) => (
          <Box key={review._id}>
            <UserReviewCard
              review={review.user_rating.review}
              ratingValue={roundToHalf(review.user_rating.rating_value)}
              user={review.user_id}
              product_id={review.product_id}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default ReviewsContent;
