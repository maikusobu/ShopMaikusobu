import { Image, ImageProps } from "@mantine/core";
import logo from "../../assets/logo.svg";
function Logo(props: ImageProps) {
  return (
    <Image
      src={logo}
      alt="Logo"
      width={props.width ? props.width : 100}
      height={props.height ? props.height : 50}
      radius="md"
      style={props.style}
      {...props}
    />
  );
}

export default Logo;
