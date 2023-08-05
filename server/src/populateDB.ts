const express = require("express");
const mongoose = require("mongoose");

import { fakerVI as vietnameseFaker } from "@faker-js/faker";

require("dotenv").config();
import expressAsyncHandler from "express-async-handler";
import productModel from "./api/v1/models/Product_management/productModel";
import product_categoryModel from "./api/v1/models/Product_management/product_categoryModel";
import product_discountModel from "./api/v1/models/Product_management/product_discountModel";
import product_inventoryModel from "./api/v1/models/Product_management/product_inventoryModel";
import product_rating from "./api/v1/models/Product_management/product_ratingModel";
import userModel from "./api/v1/models/User_management/userModel";
import { Request, Response } from "express";
const app = express();
mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err: any) => {
  console.error("MongoDB connection error:", err);
});

app.get(
  "/",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const products = [];
      const userRandom = await userModel.findOne();
      for (let i = 0; i < 40; i++) {
        console.log("add database at", i);
        const name = vietnameseFaker.commerce.productName();
        const desc = vietnameseFaker.lorem.sentence();
        const SKU = vietnameseFaker.string.alphanumeric(6).toUpperCase();
        const price = vietnameseFaker.commerce.price({
          min: 100,
          max: 200,
          dec: 0,
        });
        let imageUrlArray = Array(4).fill(null);
        imageUrlArray = imageUrlArray.map(() =>
          vietnameseFaker.image.urlLoremFlickr({
            category: `${vietnameseFaker.commerce
              .department()
              .replace(/s/g, "")}`,
            height: 200,
            width: 200,
          })
        );
        const amountPurchased = vietnameseFaker.number.int({ min: 1 });
        const rating = await product_rating.create({
          user_id: userRandom ? userRandom._id : null,
          rating_value: vietnameseFaker.number.float({ min: 1, max: 5 }),
          review: vietnameseFaker.company.catchPhrase(),
        });
        const [category, discount, inventory] = await Promise.all([
          product_categoryModel.create({
            name: [
              vietnameseFaker.commerce.department(),
              vietnameseFaker.commerce.department(),
              vietnameseFaker.commerce.department(),
              vietnameseFaker.commerce.department(),
              vietnameseFaker.commerce.department(),
            ],
          }),
          product_discountModel.create({
            name: vietnameseFaker.lorem.word(),
            desc: vietnameseFaker.lorem.sentence(),
            discount_percent: vietnameseFaker.number.float({
              min: 10,
              max: 100,
              precision: 0.001,
            }),
            active: vietnameseFaker.datatype.boolean(0.5),
          }),
          product_inventoryModel.create({
            quantity: vietnameseFaker.number.int({ min: 0, max: 100 }),
          }),
        ]);

        const product = await productModel.create({
          name,
          desc,
          SKU,
          price,
          category_id: category._id,
          discount_id: discount._id,
          inventory_id: inventory._id,
          rating_id: rating._id,
          image: imageUrlArray,
          amountPurchased,
        });

        products.push(product);
      }

      res.json(products);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  })
);
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
