const fs = require("fs");
const path = require("path"); // أضف هذه السطر
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const dbConnection = require("../../config/database");

// eslint-disable-next-line import/no-extraneous-dependencies
require("colors");

const Product = require("../../models/productModal");

dotenv.config({ path: path.join(__dirname, "../../config.env") });
console.log("start connection");
// dbConnection();
const dbURL = process.env.DB_CONNECTION;

const dbConnection = () => {
  mongoose
    .connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    })
    .then((conn) => {
      console.log(`database connected : ${conn.connection.host}`);
    });
};

dbConnection();

const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
// insert data to database

const insertData = async () => {
  try {
    await Product.create(products);
    console.log(`Data inserted`.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// delete data from db
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log(`Data deleted`.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
