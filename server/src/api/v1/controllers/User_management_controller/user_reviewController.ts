import { Request, Response, NextFunction } from "express";
import user_review from "../../models/User_management/user_review";
import user_rating from "../../models/User_management/user_rating";
import user_reaction from "../../models/User_management/user_reaction";
import userModel from "../../models/User_management/userModel";
import expressAsyncHandler from "express-async-handler";
import { error } from "console";

export const getReviewRating = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await user_review
        .find({
          product_id: req.params.product_id,
        })
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
      res.status(200).json(review);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);
export const getHighestReview = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      user_review
        .aggregate([
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
        ])
        .then(
          (result) => {
            res.status(200).json(result);
          },
          (error) => {
            throw error;
          }
        );
    } catch (error) {
      return next(error);
    }
  }
);
export const updateUserReaction = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_sent_id, user_received_id, isUpvote, isDownvote, id_rating } =
      req.body;

    try {
      if (user_sent_id === user_received_id) {
        res.status(400).json({ message: "Can't react to yourself" });
      }
      const reaction = await user_reaction.findById(id_rating);
      console.log(isDownvote, isUpvote);
      if (!reaction) throw new Error("Not found");
      reaction.upvote = Array.from(new Set(reaction.upvote));
      reaction.downvote = Array.from(new Set(reaction.downvote));
      if (isUpvote) {
        reaction.upvote.push(user_sent_id);
      } else if (isDownvote) {
        reaction.downvote.push(user_sent_id);
      } else {
        let upvoteIndex = reaction.upvote.indexOf(user_sent_id);
        if (upvoteIndex !== -1) {
          reaction.upvote.splice(upvoteIndex, 1);
        }
        let downvoteIndex = reaction.downvote.indexOf(user_sent_id);
        if (downvoteIndex !== -1) {
          reaction.downvote.splice(downvoteIndex, 1);
        }
        console.log(reaction.upvote.length, reaction.downvote.length);
        console.log(upvoteIndex, downvoteIndex);
      }
      await reaction.save();
      res.status(200).json({ message: "success" });
    } catch (err) {
      return next(err);
    }
  }
);
