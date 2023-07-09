const express = require("express");
const mongoose = require("mongoose");
import { faker } from "@faker-js/faker";
require("dotenv").config();
import expressAsyncHandler from "express-async-handler";
import productModel from "./api/v1/models/Product_management/productModel";
import product_categoryModel from "./api/v1/models/Product_management/product_categoryModel";
import product_discountModel from "./api/v1/models/Product_management/product_discountModel";
import product_inventoryModel from "./api/v1/models/Product_management/product_inventoryModel";
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
      for (let i = 0; i < 20; i++) {
        console.log("add database at", i);
        const name = faker.commerce.productName();
        const desc = faker.lorem.sentence();
        const SKU = faker.string.alphanumeric(6).toUpperCase();
        const price = faker.commerce.price({
          min: 100,
          max: 200,
          dec: 0,
        });
        let imageUrlArray = Array(3).fill(null);

        imageUrlArray = imageUrlArray.map(() =>
          faker.image.urlLoremFlickr({
            category: `${faker.commerce.department().replace(/s/g, "")}`,
            height: 200,
            width: 200,
          })
        );
        const amountPurchased = faker.number.int({ min: 1 });
        const category = await product_categoryModel.create({
          name: [
            faker.commerce.department(),
            faker.commerce.department(),
            faker.commerce.department(),
            faker.commerce.department(),
            faker.commerce.department(),
          ],
        });
        const discount = await product_discountModel.create({
          name: faker.lorem.word(),
          desc: faker.lorem.sentence(),
          discount_percent: faker.number.float({
            min: 10,
            max: 100,
            precision: 0.001,
          }),
          active: faker.datatype.boolean(0.5),
        });
        const inventory = await product_inventoryModel.create({
          quantity: faker.number.int({ min: 0, max: 100 }),
        });
        const product = await productModel.create({
          name,
          desc,
          SKU,
          price,
          category_id: category._id,
          discount_id: discount._id,
          inventory_id: inventory._id,
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
