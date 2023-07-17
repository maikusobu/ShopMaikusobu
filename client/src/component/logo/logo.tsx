import { Image, ImageProps } from "@mantine/core";
import logo from "../../assets/logo.svg";
function Logo(props: ImageProps) {
  return (
    <Image
      src={logo}
      alt="Logo"
      width={props.width}
      height={props.height}
      radius="md"
      style={props.style}
    />
  );
}

export default Logo;
