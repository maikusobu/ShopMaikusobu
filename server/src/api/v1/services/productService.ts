/* eslint-disable @typescript-eslint/no-explicit-any */
import { PipelineStage, SortOrder } from "mongoose";
import productModel from "../models/Product_management/productModel";
import product_categoryModel from "../models/Product_management/product_categoryModel";
import product_discountModel from "../models/Product_management/product_discountModel";
import product_inventoryModel from "../models/Product_management/product_inventoryModel";

interface MyObject {
  [key: string]: SortOrder;
}
interface ProductSearchResult {
  label: string;
  id: string;
}
export const getProductsFromDB = async (
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
export const getProductById = async (id: string): Promise<any | null> => {
  return await productModel
    .findById(id)
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
};

export const getTrendingProducts = async (): Promise<any[]> => {
  return await productModel
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
};

export const searchProducts = async (
  name: string
): Promise<ProductSearchResult[]> => {
  let products: any[] = [];
  if (name) {
    products = await productModel
      .find({ name: { $regex: `${name}`, $options: "i" } }) // Searching name with case-insensitivity for example: "ALICE, Alice, alice" are matched by the regex
      .select(["_id", "name"])
      .exec();
  }
  return products.map((product) => ({
    label: product.name,
    id: product._id,
  }));
};
