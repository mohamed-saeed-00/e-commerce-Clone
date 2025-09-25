require("dotenv").config({ path: "config.env" });

const path = require("path");
const express = require("express");
const morgan = require("morgan");

// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require("cors");

// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require("compression");

const app = express();
const port = process.env.PORT || 8000;
const AppError = require("./utils/appError");
const globaleError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");

dbConnection();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const { mountsRoutes } = require("./routes");
// mounting api
app.use(express.json());
app.use(cors());
app.options("*", cors()); // include before other routes
app.use(compression());
app.use(express.static(path.join(__dirname, "uploads")));

mountsRoutes(app);

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
