/* eslint-disable @typescript-eslint/no-explicit-any */
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";
import * as productService from "../../services/productService";
const myCache = new NodeCache();
export const productGetAllMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories, sort, page = "1" } = req.query;
      const cacheKey = JSON.stringify({ categories, sort });
      let result = myCache.get(cacheKey) as any | unknown;
      if (!result) {
        result = await productService.getProductsFromDB(
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
      return next(err);
    }
  }
);
export const productGetByIdMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productService.getProductById(
        req.params.id ? req.params.id : ""
      );
      res.status(200).json(products);
    } catch (err) {
      return next(err);
    }
  }
);
export const productGetTrendingMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productService.getTrendingProducts();
      res.status(200).json(products);
    } catch (err) {
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
        products = await productService.searchProducts(name as string);
      } else products = [];
      res.status(200).json(products);
    } catch (err) {
      return next(err);
    }
  }
);
