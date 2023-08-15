import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import productModel from "../../models/Product_management/productModel";
import product_inventoryModel from "../../models/Product_management/product_inventoryModel";
import product_discountModel from "../../models/Product_management/product_discountModel";
import product_categoryModel from "../../models/Product_management/product_categoryModel";
import NodeCache from "node-cache";
import { SortOrder, PipelineStage } from "mongoose";
const myCache = new NodeCache();
interface MyObject {
  [key: string]: SortOrder;
}
export const productGetAllMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories, sort, page = "1" } = req.query;
      const cacheKey = JSON.stringify({ categories, sort });
      let result = myCache.get(cacheKey) as any | unknown;
      if (!result) {
        result = await getProductsFromDB(
          categories as string,
          sort as string,
          parseInt(page as string)
        );
        myCache.set(cacheKey, result);
      }
      res.status(200).json({
        total: result.total,
        page,
        products: result.products,
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);

const getProductsFromDB = async (
  categories: string,
  sort: string,
  page: number
) => {
  const arrayCategories = categories ? (categories as string).split(",") : [];
  const sortOptions: Record<string, MyObject> = {
    relevant: { name: -1 },
    newest: { createdAt: -1 },
    popular: { amountPurchases: 1 },
    lowestprice: { price: 1 },
    highestprice: { price: -1 },
  };
  const productsPerPage = 36;
  const skip = productsPerPage * (page - 1);
  const limit = productsPerPage;

  const pipeline = [
    {
      $lookup: {
        from: "productcategories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $match: {
        $expr: {
          $setIsSubset: [arrayCategories, "$category.name"],
        },
      },
    },
    {
      $facet: {
        total: [
          {
            $count: "count",
          },
        ],
        products: [
          {
            $sort: sortOptions[sort],
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $lookup: {
              from: "productinventories",
              localField: "inventory_id",
              foreignField: "_id",
              as: "inventory",
            },
          },
          {
            $unwind: "$inventory",
          },
          {
            $match: {
              "inventory.quantity": { $gt: 0 },
            },
          },
          {
            $lookup: {
              from: "productdiscounts",
              localField: "discount_id",
              foreignField: "_id",
              as: "discount",
            },
          },
        ],
      },
    },
  ];

  const result = await productModel
    .aggregate(pipeline as PipelineStage[])
    .exec();
  const total = result[0].total[0]?.count || 0;
  const products = result[0].products;
  return { total, products };
};

export const productGetByIdMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productModel
        .findById(req.params.id)
        .lean()
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
      const { name } = req.query;
      if (name !== null && name !== undefined && name !== "") {
        products = await productModel
          .find({ name: { $regex: `${name}`, $options: "i" } }) // Saerching name with case-insenitivity for example: "ALICE, Alice, alice " are matched by the regex
          .select(["_id", "name"])
          .exec();
      } else products = [];
      const transformedProducts = (products as any[]).map((product) => ({
        label: product.name,
        id: product._id,
      }));
      res.status(200).json(transformedProducts);
    } catch (err) {
      return next(err);
    }
  }
);
