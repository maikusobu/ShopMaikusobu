type CardProps = {
  image: string;
  content: string;
  color: string;
  title: string;
};
import { Title, Stack, Text, BackgroundImage, Box } from "@mantine/core";

function CardBanner({ image, content, title, color }: CardProps) {
  return (
    <Box sx={() => ({ width: "100%", height: "100%" })}>
      <BackgroundImage
        src={image}
        sx={() => ({ width: "100%", height: "100%" })}
      >
        <Stack
          justify="center"
          spacing={0}
          sx={() => ({
            width: "100%",
            height: "100%",
            padding: "44px",
            backgroundColor: "rgba(0,0,0,0.5)",
          })}
        >
          <Title sx={() => ({ color: `${color}` })}>{title}</Title>
          <Text sx={() => ({ color: "white" })}>{content}</Text>
        </Stack>
      </BackgroundImage>
    </Box>
  );
}

export default CardBanner;
