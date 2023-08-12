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
      sx={{
        backgroundColor: selected ? "#F8F8F8" : "#FFFFFF",
      }}
      onClick={onSelect}
    >
      <Group>
        <Avatar src={imageUrl} radius="xl" />
        <Text>{user?.username}</Text>
      </Group>
      <StatusIcon connected={connect} />
      {hasNewMessages && <Text>New</Text>}
    </Button>
  );
}

export default UserChat;
