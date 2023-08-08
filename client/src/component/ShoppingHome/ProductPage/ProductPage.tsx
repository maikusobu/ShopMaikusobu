import { Box, Group, Skeleton, Stack } from "@mantine/core";
import { useGetProductByIdQuery } from "../../../api/ProductReducer/ProductApi";
import { useParams } from "react-router-dom";
import EmblaCarousel from "./ImageSlideCarousel/ImageSlideCarousel";
import ProductDetail from "./ProductInfomation/ProductInfomation";
import UserReviews from "./UserReviews/UserReviews";
import { EmblaOptionsType } from "embla-carousel-react";
function ProductPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id);

  const OPTIONS: EmblaOptionsType = {};
  const SLIDES = Array.from(Array(data ? data.image.length : 10).keys());
  return (
    <Box>
      <Group noWrap p="lg" spacing={50} align="start">
        <Skeleton visible={isLoading}>
          <EmblaCarousel
            slides={SLIDES}
            options={OPTIONS}
            images={data ? data.image : []}
          />
        </Skeleton>
        <Skeleton visible={isLoading}>
          <ProductDetail data={data} />
        </Skeleton>
      </Group>
      <Stack>
        <UserReviews product_id={id} />
      </Stack>
      {/* build recommendation in here */}
    </Box>
  );
}

export default ProductPage;
