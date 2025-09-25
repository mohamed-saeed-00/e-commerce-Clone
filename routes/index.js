const categoryRoutes = require("./categoryRoutes");
const subCategoryRoutes = require("./subCategoryRoutes");
const brandRouter = require("./brandsRoute");
const productRouter = require("./productRoutes");
const userRouter = require("./userRoute");
const authRouter = require("./authRoute");
const reviewRouter = require("./reviewRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const addressesRoutes = require("./addressesRoutes");
const couponRoutes = require("./couponsRoutes");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

// amount routes her

exports.mountsRoutes = (app) => {
  app.use("/api/categories", categoryRoutes);
  app.use("/api/subcategories", subCategoryRoutes);
  app.use("/api/brands", brandRouter);
  app.use("/api/products", productRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/addresses", addressesRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/cart", cartRoute);
  app.use("/api/orders", orderRoute);
};
