const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const message = error.statusCode ? error.message : "Something went wrong";

  return res.status(statusCode).json({ message });
};

module.exports = errorHandlerMiddleware;
