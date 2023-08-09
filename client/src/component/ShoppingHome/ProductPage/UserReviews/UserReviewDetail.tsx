import useAvatar from "../../../../hook/useAvatar";
import { useState } from "react";
import type { UserJson } from "../../../../api/UserApi/UserApi";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { Box, Group, Text, Stack, ActionIcon, Avatar } from "@mantine/core";
import { selectAuth } from "../../../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../../../app/hooks";
import { useUpdateReactionMutation } from "../../../../api/UserApi/UserApi";

function UserReviewDetail({
  user,
  reactionValue,
  product_id,
  id_rating,
  isUpvote,
  isDownvote,
}: {
  user: UserJson;
  reactionValue: number;
  product_id: string;
  id_rating: string;
  isUpvote: boolean;
  isDownvote: boolean;
}) {
  const imageUrl = useAvatar(user);
  const [isUpvoteValue, setIsUpvoteValue] = useState(isUpvote);
  const [isDownvoteValue, setIsDownvoteValue] = useState(isDownvote);
  const [updateReaction] = useUpdateReactionMutation();
  const auth = useAppSelector(selectAuth);
  console.log(isUpvoteValue, isDownvoteValue);
  const handleUpdateReaction = (value: string) => {
    let currentUpvote = isUpvoteValue;
    let currentDownvote = isDownvoteValue;
    if (value === "upvote") {
      if (isUpvoteValue) {
        setIsUpvoteValue(false);
        currentUpvote = false;
      } else {
        setIsUpvoteValue(true);
        setIsDownvoteValue(false);
        currentUpvote = true;
        currentDownvote = false;
      }
    } else if (value === "downvote") {
      if (isDownvoteValue) {
        setIsDownvoteValue(false);
        currentDownvote = false;
      } else {
        setIsDownvoteValue(true);
        setIsUpvoteValue(false);
        currentDownvote = true;
        currentUpvote = false;
      }
    }
    updateReaction({
      product_id: product_id,
      id_rating: id_rating,
      isUpvote: currentUpvote,
      isDownvote: currentDownvote,
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
          <Text w="30px" align="center">
            {reactionValue}
          </Text>
          <Stack>
            <ActionIcon onClick={() => handleUpdateReaction("upvote")}>
              <IconArrowUp color={`${isUpvoteValue ? "red" : "white"}`} />
            </ActionIcon>
            <ActionIcon onClick={() => handleUpdateReaction("downvote")}>
              <IconArrowDown color={`${isDownvoteValue ? "red" : "white"}`} />
            </ActionIcon>
          </Stack>
        </Group>
        <Group>
          <Avatar
            src={imageUrl}
            alt="avatar"
            radius="xl"
            sx={{
              border: "1px solid #ccc",
            }}
          />
          <Text>{user.username}</Text>
        </Group>
      </Group>
    </Box>
  );
}

export default UserReviewDetail;
