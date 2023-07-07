import { Group, Button, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
const useStyles = createStyles(() => ({
  group: {
    padding: 0,
  },
}));
function ButtonAutehn() {
  const { classes } = useStyles();
  return (
    <Group position="center" className={classes.group}>
      <Link to="authen/login">
        <Button variant="default">Sign in</Button>
      </Link>
      <Link to="authen/signup">
        <Button>Sign up</Button>
      </Link>
    </Group>
  );
}

export default ButtonAutehn;
