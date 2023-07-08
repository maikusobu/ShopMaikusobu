import { Carousel } from "@mantine/carousel";
import { createStyles, getStylesRef, rem } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import CardBanner from "../Card/Card";
import collaborative from "../../../assets/collaborative.jpg";
import secure from "../../../assets/secure.jpg";
import social from "../../../assets/social.jpg";
import commerce from "../../../assets/commerce.jpg";
import { useRef } from "react";
const useStyles = createStyles(() => ({
  controls: {
    ref: getStylesRef("controls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  root: {
    "&:hover": {
      [`& .${getStylesRef("controls")}`]: {
        opacity: 1,
      },
    },
    borderRadius: rem(40),
  },
}));
const content = [
  {
    title: "Commerical",
    image: commerce,
    color: "#33c233",
    content:
      "Boost your sales with our website. We offer you the best tools and features to showcase your products and services to millions of potential customers",
  },
  {
    title: "Collaboration",
    image: collaborative,
    color: "#ffff00",
    content:
      "Work together on our website. We enable you to collaborate with your team members, partners and clients on various projects and tasks. You can chat, share files, assign roles and track progress on our website",
  },
  {
    title: "Secure",
    image: secure,
    color: "#cc99cc",
    content:
      "Trust our security on our website. We take your privacy and safety seriously, and we use the highest standards of encryption and authentication to protect your data and transactions",
  },
  {
    title: "Social",
    image: social,
    color: "#66a3e0",
    content:
      "Boost your sales with our website. We offer you the best tools and features to showcase your products and services to millions of potential customers.",
  },
];
function CarouselBanner() {
  const { classes } = useStyles();
  const autoplay = useRef(Autoplay({ delay: 4000 }));
  return (
    <Carousel
      classNames={classes}
      maw={500}
      mx="auto"
      withIndicators
      height={300}
      loop
      align="start"
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play(false)}
      style={{
        position: "relative",
        margin: 0,
        transform: "translateX(-25%)",
      }}
      styles={{
        indicator: {
          width: rem(20),
          height: rem(4),
          transition: "width 250ms ease",

          "&[data-active]": {
            width: rem(40),
          },
        },
      }}
    >
      {content.map((item, index) => (
        <Carousel.Slide>
          <CardBanner
            color={item.color}
            key={index}
            title={item.title}
            image={item.image}
            content={item.content}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}

export default CarouselBanner;
