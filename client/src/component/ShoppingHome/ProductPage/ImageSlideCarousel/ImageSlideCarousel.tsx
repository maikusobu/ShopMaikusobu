import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { Thumb } from "./ImageSlideCarouselButton";
import imageByIndex from "./ImageByIndex";
import { Stack, Group, Box, Image } from "@mantine/core";
type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
  images: string[];
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, images } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: false,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <Stack
      sx={{
        width: "500px",

        border: "2px solid white",
      }}
      spacing={0}
    >
      <Box
        sx={{
          overflow: "hidden",
        }}
        ref={emblaMainRef}
      >
        <Group noWrap spacing={0}>
          {slides.map((index) => (
            <Image
              key={index}
              sx={{
                flexShrink: 0,
                flexGrow: 0,
                display: "block",
                width: "100%",
                height: "300px",
                objectFit: "cover",
              }}
              src={imageByIndex(index, images)}
              alt="Ảnh đang được tải về đợi xíu"
            />
          ))}
        </Group>
      </Box>
      <Box sx={{}}>
        <Box ref={emblaThumbsRef} sx={{ overflow: "hidden" }}>
          <Group noWrap spacing={0}>
            {slides.map((index) => (
              <Thumb
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
                imgSrc={imageByIndex(index, images)}
                key={index}
              />
            ))}
          </Group>
        </Box>
      </Box>
    </Stack>
  );
};

export default EmblaCarousel;
