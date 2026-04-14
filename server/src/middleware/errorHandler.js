const ApiError = require("../utils/apiError");
const { sendError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message);
  }

  // Prisma known errors
  if (err.code === "P2002") {
    return sendError(res, 409, "A record with that value already exists");
  }
  if (err.code === "P2025") {
    return sendError(res, 404, "Record not found");
  }

  return sendError(res, 500, "Internal server error");
};

module.exports = errorHandler;
