import expressAsyncHandler from "express-async-handler";
import express, { Request, Response } from "express";
const mongoose = require("mongoose");
import { fakerVI as vietnameseFaker, faker } from "@faker-js/faker";
import product_categoryModel from "./api/v1/models/Product_management/product_categoryModel";
import product_discountModel from "./api/v1/models/Product_management/product_discountModel";
import product_inventoryModel from "./api/v1/models/Product_management/product_inventoryModel";
import productModel from "./api/v1/models/Product_management/productModel";
import userModel from "./api/v1/models/User_management/userModel";
import shopping_session from "./api/v1/models/Shopping_process/shopping_session";
import user_addressManagerModel from "./api/v1/models/User_management/user_addressManagerModel";
import user_manager_paymentModel from "./api/v1/models/User_management/user_manager_paymentModel";
import user_review from "./api/v1/models/User_management/user_review";
import user_rating from "./api/v1/models/User_management/user_rating";

require("dotenv").config();
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
      const products: any[] = [];
      const users: any[] = [];
      const promises = [];
      for (let i = 0; i < 25; i++) {
        console.log("add user", i);
        const user = new userModel({
          first_name: vietnameseFaker.person.firstName(),
          last_name: vietnameseFaker.person.lastName(),
          username: faker.lorem.word(),
          email: vietnameseFaker.internet.email({
            lastName: vietnameseFaker.person.firstName() as string,
            firstName: vietnameseFaker.person.lastName() as string,
            provider: "proMaikusobu.com",
          }),
          picture: vietnameseFaker.image.avatar(),
          isVerified: true,
          password: vietnameseFaker.helpers.fromRegExp(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/
          ),
        });
        users.push(user);
        promises.push(
          user.save().then(() => {
            return Promise.all([
              shopping_session.create({
                user_id: user._id,
                cart_items: [],
              }),
              user_addressManagerModel.create({
                user_id: user._id,
                address_list: [],
              }),
              user_manager_paymentModel.create({
                user_id: user._id,
                payment_list: [],
              }),
            ]);
          })
        );
      }
      await Promise.all(promises);
      for (let i = 0; i < 120; i++) {
        console.log("add  product at", i);
        const name = vietnameseFaker.commerce.productName();
        const desc = vietnameseFaker.word.words({ count: { min: 5, max: 10 } });
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
          image: imageUrlArray,
          amountPurchased,
        });
        products.push(product);
      }

      for (let i = 0; i < 100; i++) {
        console.log("add review at", i);
        const product_id = vietnameseFaker.helpers.arrayElement(products)._id;
        const user_id = vietnameseFaker.helpers.arrayElement(users)._id;
        const rating = new user_rating({
          rating_value: vietnameseFaker.number.float({ min: 1, max: 5 }),
          review: vietnameseFaker.lorem.sentence(),
        });
        const review = new user_review({
          user_id,
          product_id,
          user_rating: rating._id,
          reactionScore: vietnameseFaker.number.int({ min: 0, max: 100 }),
        });
        await Promise.all([rating.save(), review.save()]);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  })
);
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
