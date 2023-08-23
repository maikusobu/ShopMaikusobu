import * as reviewService from "../../services/reviewService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
export const getReviewRating = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await reviewService.getReviewRating(
        req.params.product_id ? req.params.product_id : ""
      );
      res.status(200).json(review);
    } catch (error) {
      return next(error);
    }
  }
);

export const getHighestReview = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await reviewService.getHighestReview();
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);
export const updateUserReaction = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await reviewService.updateUserReaction(req.body);
      res.status(200).json({ message: "success" });
    } catch (err) {
      return next(err);
    }
  }
);
