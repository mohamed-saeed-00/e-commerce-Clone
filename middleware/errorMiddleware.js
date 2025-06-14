const globaleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-use-before-define
    errorFromDev(err, res);
  } else {
    // eslint-disable-next-line no-use-before-define
    errorFromProd(err, res);
  }
};

const errorFromDev = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });

const errorFromProd = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

module.exports = globaleError;
