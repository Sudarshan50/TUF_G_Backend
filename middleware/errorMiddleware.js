import { errorResponse } from "../utils/apiResponse.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === "ValidationError") {
    return errorResponse(res, "Validation Error", err.errors, 400);
  }

  if (err.name === "CastError") {
    return errorResponse(
      res,
      `Resource not found with id: ${err.value}`,
      null,
      404
    );
  }

  // if (err.name === "SyntaxError" && err.status === 400 && "body" in err) {
  //   return errorResponse(res, "Bad JSON", null, 400);
  // }

  if (err.code === "ENOENT") {
    return errorResponse(res, "File not found", null, 404);
  }

  if (err.code === "EACCES") {
    return errorResponse(res, "Permission denied", null, 403);
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", null, 401);
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, "Token expired", null, 401);
  }

  return errorResponse(
    res,
    err.message || "Internal Server Error",
    null,
    statusCode
  );
};

export default errorHandler;
