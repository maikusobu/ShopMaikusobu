import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import productModel from "../../models/Product_management/productModel";
import product_inventoryModel from "../../models/Product_management/product_inventoryModel";
import product_discountModel from "../../models/Product_management/product_discountModel";
import product_categoryModel from "../../models/Product_management/product_categoryModel";
import NodeCache from "node-cache";
import product_ratingModel from "../../models/Product_management/product_ratingModel";
const myCache = new NodeCache();
export const productGetAllMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = JSON.stringify({
        categories: req.query.categories,
        sort: req.query.sort,
      });
      let products = myCache.get(cacheKey) as any[] | unknown;
      if (!products) {
        req.query.page = req.query.page ? req.query.page : "1";
        const arrayCategories = req.query.categories
          ? (req.query.categories as string).split(",")
          : [];
        const productsPromiseBase = productModel
          .find({})
          .sort({
            ...(req.query.sort === "relevant" && { name: -1 }),
            ...(req.query.sort === "newest" && { createdAt: -1 }),
            ...(req.query.sort === "popular" && { amountPurchases: 1 }),
            ...(req.query.sort === "lowestprice" && { price: 1 }),
            ...(req.query.sort === "highestprice" && { price: -1 }),
          })
          .populate({
            path: "inventory_id",
            model: product_inventoryModel,
            match: { quantity: { $gt: 0 } },
          })
          .populate({
            path: "discount_id",
            model: product_discountModel,
          })
          .populate({
            path: "category_id",
            model: product_categoryModel,
          })
          .populate({
            path: "rating_id",
            model: product_ratingModel,
          });
        products = await productsPromiseBase.exec();

        products = (products as any[]).filter((product) => {
          if (arrayCategories.length === 0) return true;
          return product.category_id.name.includes(...arrayCategories);
        });
        myCache.set(cacheKey, products);
      }
      res.status(200).json({
        total: (products as any[]).length,
        page: req.query.page,
        products: (products as any[]).slice(
          36 * (parseInt(req.query.page as string) - 1),
          36 * parseInt(req.query.page as string)
        ),
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);

export const productGetByIdMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productModel
        .findById(req.params.id)
        .populate({
          path: "inventory_id",
          model: product_inventoryModel,
          match: { quantity: { $gt: 0 } },
        })
        .populate({
          path: "discount_id",
          model: product_discountModel,
        })
        .populate({
          path: "category_id",
          model: product_categoryModel,
        })
        .populate({
          path: "rating_id",
          model: product_ratingModel,
        })
        .exec();
      res.status(200).json(products);
    } catch (err) {
      return next(err);
    }
  }
);
export const productGetTrendingMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productModel
        .find({})
        .populate({
          path: "inventory_id",
          model: product_inventoryModel,
          match: { quantity: { $gt: 0 } },
        })
        .populate({
          path: "discount_id",
          model: product_discountModel,
        })
        .sort({ amountPurchases: -1 })
        .limit(10)
        .exec();
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);
export const productSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let products: any[];
      console.log(req.query.name, "why it here ?");
      if (
        req.query.name !== null &&
        req.query.name !== undefined &&
        req.query.name !== ""
      ) {
        console.log(req.query.name, "why it here ?");
        products = await productModel
          .find({ name: { $regex: `${req.query.name}`, $options: "i" } })
          .select(["_id", "name"])
          .exec();
      } else products = [];
      const transformedProducts = (products as any[]).map((product) => ({
        label: product.name,
        id: product._id,
      }));
      res.status(200).json(transformedProducts);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);
