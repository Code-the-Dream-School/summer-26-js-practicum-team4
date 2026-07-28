const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api-error");

class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.CONFLICT);
  }
}

module.exports = ConflictError;
