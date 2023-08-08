import useAvatar from "../../../../hook/useAvatar";
import { useState } from "react";
import type { UserJson } from "../../../../api/UserApi/UserApi";
import { Image, Box, Group, Text, Stack, ActionIcon } from "@mantine/core";
import { selectAuth } from "../../../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../../../app/hooks";
import { useUpdateReactionMutation } from "../../../../api/UserApi/UserApi";
function UserReviewDetail({
  user,
  reactionValue,
  product_id,
  id_rating,
}: {
  user: UserJson;
  reactionValue: number;
  product_id: string;
  id_rating: string;
}) {
  const imageUrl = useAvatar(user);
  const [value, setValue] = useState(reactionValue);
  const [updateReaction] = useUpdateReactionMutation();
  const auth = useAppSelector(selectAuth);
  const handleUpdateReaction = (value: number) => {
    setValue(value);
    updateReaction({
      product_id: product_id,
      id_rating: id_rating,
      reactionValue: value,
      user_sent_id: auth.id,
      user_received_id: user.id,
    })
      .unwrap()
      .then(() => {
        console.log("Successful");
      })
      .catch(() => {
        console.log("error");
      });
  };
  return (
    <Box>
      <Group>
        <Group>
          <Text>{value}</Text>
          <Stack>
            <ActionIcon onClick={() => handleUpdateReaction(value + 1)}>
              +
            </ActionIcon>
            <ActionIcon onClick={() => handleUpdateReaction(value - 1)}>
              -
            </ActionIcon>
          </Stack>
        </Group>
        <Group>
          <Image src={imageUrl} alt="avatar" radius="xl" height={20} />
          <Text>{user.username}</Text>
        </Group>
      </Group>
    </Box>
  );
}

export default UserReviewDetail;
