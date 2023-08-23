import user_review from "../models/User_management/user_review";
import user_rating from "../models/User_management/user_rating";
import user_reaction from "../models/User_management/user_reaction";
import userModel from "../models/User_management/userModel";
import { HttpError, NotFound } from "../interfaces/ErrorInstances";
import mongoose from "mongoose";
interface UpdateUserReactionData {
  user_sent_id: string;
  user_received_id: string;
  isUpvote: boolean;
  isDownvote: boolean;
  id_rating: string;
}
export const getReviewRating = async (product_id: string) => {
  return await user_review
    .find({
      product_id,
    })
    .lean()
    .populate({
      path: "user_rating",
      model: user_rating,
    })
    .populate({
      path: "user_id",
      model: userModel,
    })
    .populate({
      path: "reactionScore",
      model: user_reaction,
    })
    .exec();
};
export const getHighestReview = async () => {
  return await user_review.aggregate([
    {
      $match: {
        product_id: { $type: "objectId" },
      },
    },
    {
      $lookup: {
        from: "userratings",
        localField: "user_rating",
        foreignField: "_id",
        as: "user_rating",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_id",
      },
    },
    {
      $lookup: {
        from: "userreactions",
        localField: "reactionScore",
        foreignField: "_id",
        as: "reactionScore",
      },
    },
    { $unwind: "$user_rating" },
    { $unwind: "$user_id" },
    { $unwind: "$reactionScore" },
    {
      $project: {
        user_id: 1,
        product_id: 1,
        user_rating: 1,
        reactionScore: 1,
        score: {
          $subtract: [
            { $size: "$reactionScore.upvote" },
            { $size: "$reactionScore.downvote" },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
  ]);
};

export const updateUserReaction = async (data: UpdateUserReactionData) => {
  const { user_sent_id, user_received_id, isUpvote, isDownvote, id_rating } =
    data;

  if (user_sent_id === user_received_id) {
    throw new HttpError(400, "You can't react yourself");
  }
  const reaction = await user_reaction.findById(id_rating);
  if (!reaction) throw new NotFound(404, "Not found");
  reaction.upvote = Array.from(new Set(reaction.upvote));
  reaction.downvote = Array.from(new Set(reaction.downvote));
  if (isUpvote) {
    reaction.upvote.push(new mongoose.Types.ObjectId(user_sent_id));
  } else if (isDownvote) {
    reaction.downvote.push(new mongoose.Types.ObjectId(user_sent_id));
  } else {
    const upvoteIndex = reaction.upvote.indexOf(
      new mongoose.Types.ObjectId(user_sent_id)
    );
    if (upvoteIndex !== -1) {
      reaction.upvote.splice(upvoteIndex, 1);
    }
    const downvoteIndex = reaction.downvote.indexOf(
      new mongoose.Types.ObjectId(user_sent_id)
    );
    if (downvoteIndex !== -1) {
      reaction.downvote.splice(downvoteIndex, 1);
    }
  }
  await reaction.save();
};
