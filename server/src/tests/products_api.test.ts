import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
const api = supertest(app);
newFunction();
afterAll(async () => {
  await mongoose.connection.close();
});
const test = require("jest");

test("all products are returned", async () => {
  await api
    .get("/products")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("one product is returned", async () => {
  await api
    .get("/products/5f8c8c6b7d4b4d0a7c5f4d1f")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("product is added", async () => {
  const newProduct = {
    name: "test product",
    price: 100,
    description: "test description",
  };
  await api
    .post("/products")
    .send(newProduct)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

function newFunction() {
  test("products are returned as json", async () => {
    await api
      .get("/products/trending")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
}
