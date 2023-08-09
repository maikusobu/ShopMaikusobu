import { Request, Response, NextFunction } from "express";
import user_review from "../../models/User_management/user_review";
import user_rating from "../../models/User_management/user_rating";
import user_reaction from "../../models/User_management/user_reaction";
import userModel from "../../models/User_management/userModel";
import expressAsyncHandler from "express-async-handler";
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
export const updateUserReaction = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_sent_id, user_received_id, reactionValue, id_rating } =
      req.body;
    if (user_sent_id === user_received_id) {
      res.status(400).json({ message: "Can't react to yourself" });
    }
    try {
      await user_review.findByIdAndUpdate(id_rating, {
        $inc: {
          reactionScore: reactionValue,
        },
      });
      res.status(200).json({ message: "success" });
    } catch (err) {
      return next(err);
    }
  }
);
