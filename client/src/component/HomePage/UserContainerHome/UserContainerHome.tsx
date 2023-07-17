import { Group, createStyles, rem } from "@mantine/core";
import { useState } from "react";
import UserIn from "../../user/user";
import { IconGardenCart, IconMessage } from "@tabler/icons-react";
import CartHover from "../CartHover/CartHover";
import { useNavigate } from "react-router";
const useStyles = createStyles(() => ({
  IconContainer: {
    width: rem(60),
    height: rem(40),
    display: "flex",
    justifyContent: "center",
    padding: "2px 4px",
    alignItems: "center",
    cursor: "pointer",
    border: "5px solid whtie !important",
  },
}));
function UserContainerHome() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { classes, theme } = useStyles();
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <Group spacing={24} position="left" noWrap>
      <Group spacing={5} position="left" noWrap>
        <div
          onMouseEnter={handleMouseEnter}
          onClick={() => navigate("/cart")}
          onMouseLeave={handleMouseLeave}
          className={classes.IconContainer}
        >
          <IconGardenCart size="2rem" stroke={1.5} />
        </div>
        <IconMessage size="1.25rem" color={theme.colors.blue[6]} stroke={1.5} />
      </Group>
      {
        <CartHover
          isHovered={isHovered}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      }
      <UserIn />
    </Group>
  );
}

export default UserContainerHome;
