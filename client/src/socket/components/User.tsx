import { Avatar, Button, Group, Text } from "@mantine/core";
import useAvatar from "../../hook/useAvatar";
import { useGetUserByIdQuery } from "../../api/UserApi/UserApi";
import StatusIcon from "./StatusIcon";
function UserChat({
  id,
  selected,
  connect,
  onSelect,
  hasNewMessages,
}: {
  id: string;
  selected: boolean;
  connect: boolean;
  hasNewMessages: boolean;
  onSelect: () => void;
}) {
  const { data: user } = useGetUserByIdQuery(id);
  const imageUrl = useAvatar(user ? user : null);
  return (
    <Button
      color={selected ? "pink" : "grape"}
      sx={{
        "&:hover ": {
          backgroundColor: "none !important",
        },
      }}
      onClick={onSelect}
      p="0px"
    >
      <Group position="left" w="230px">
        <StatusIcon connected={connect} />
        <Avatar src={imageUrl} radius="xl" />
        <Text>{user?.username}</Text>
      </Group>

      {hasNewMessages && <Text>New</Text>}
    </Button>
  );
}

export default UserChat;
