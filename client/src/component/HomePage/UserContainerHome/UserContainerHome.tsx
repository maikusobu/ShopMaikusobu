import { Group, createStyles, rem } from "@mantine/core";
import { useState, useRef } from "react";
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
  const { classes } = useStyles();
  const cardRef = useRef<HTMLDivElement>(null);
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
          onClick={() => navigate("/shopping/cart")}
          onMouseLeave={handleMouseLeave}
          ref={cardRef}
          className={classes.IconContainer}
        >
          <IconGardenCart size="2rem" stroke={1.5} />
        </div>
      </Group>
      {
        <CartHover
          isHovered={isHovered}
          cardNode={cardRef.current}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      }

      <UserIn />
    </Group>
  );
}

export default UserContainerHome;
