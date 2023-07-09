import { Image } from "@mantine/core";
import logo from "../../../assets/logo.svg";
function Logo() {
  return (
    <Image
      src={logo}
      alt="Logo"
      width={40}
      height={40}
      radius="md"
      style={{
        transform: "translateX(40px)",
      }}
    />
  );
}

export default Logo;
