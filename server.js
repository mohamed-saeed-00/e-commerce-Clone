require("dotenv").config({ path: "config.env" });

const path = require("path");
const express = require("express");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 8000;
const AppError = require("./utils/appError");
const globaleError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");

dbConnection();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const brandRouter = require("./routes/brandsRoute");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const reviewRouter = require("./routes/reviewRoutes");
// mounting api
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/brands", brandRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(`can not found your distnation api ${req.originalUrl}  `, 400)
  );
});

// globale error middleware
app.use(globaleError);

const server = app.listen(port, () => {
  console.log(`start listening on ${port}`);
});

// handeling rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandeled rejection error => ${err.name} | ${err.message} `);
  server.close(() => {
    console.log("shutting down....");
    process.exit(1);
  });
});
