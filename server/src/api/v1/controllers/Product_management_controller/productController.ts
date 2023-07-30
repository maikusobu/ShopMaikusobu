import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import productModel from "../../models/Product_management/productModel";
import product_inventoryModel from "../../models/Product_management/product_inventoryModel";
import product_discountModel from "../../models/Product_management/product_discountModel";
import product_categoryModel from "../../models/Product_management/product_categoryModel";
import NodeCache from "node-cache";
import product_ratingModel from "../../models/Product_management/product_ratingModel";
import { SortOrder } from "mongoose";
const myCache = new NodeCache();
interface MyObject {
  [key: string]: SortOrder;
}
export const productGetAllMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories, sort, page = "1" } = req.query;
      const cacheKey = JSON.stringify({ categories, sort });
      let products = myCache.get(cacheKey) as any[] | unknown;
      if (!products) {
        products = await getProductsFromDB(
          categories as string,
          sort as string
        );
        myCache.set(cacheKey, products);
      }
      const productsPerPage = 36;
      const startIndex = productsPerPage * (parseInt(page as string) - 1);
      const endIndex = productsPerPage * parseInt(page as string);
      const paginatedProducts = (products as any[]).slice(startIndex, endIndex); // pagination and page
      res.status(200).json({
        total: (products as any[]).length,
        page: page,
        products: paginatedProducts,
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);
const getProductsFromDB = async (categories: string, sort: string) => {
  const arrayCategories = categories ? (categories as string).split(",") : [];
  const sortOptions: Record<string, MyObject> = {
    relevant: { name: -1 },
    newest: { createdAt: -1 },
    popular: { amountPurchases: 1 },
    lowestprice: { price: 1 },
    highestprice: { price: -1 },
  };
  const productsPromiseBase = productModel
    .find({})
    .sort(sortOptions[sort])
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
  const products = await productsPromiseBase.exec();
  return (products as any[]).filter((product) => {
    if (arrayCategories.length === 0) return true;
    return product.category_id.name.includes(...arrayCategories);
  });
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
      const { name } = req.query;
      if (name !== null && name !== undefined && name !== "") {
        products = await productModel
          .find({ name: { $regex: `${name}`, $options: "i" } }) // search name with case-insenitivity for example: "ALICE, Alice, alice " are be matched by the regex
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
