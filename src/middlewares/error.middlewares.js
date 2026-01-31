import mongoose from "mongoose";
import { ApiError } from "../utils/api-error.js";
import multer from "multer";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      error = new ApiError(
        400,
        `Unexpected field: "${err.field}". Expected fields are: avatar, coverImage`,
      );
    } else if (err.code === "LIMIT_FILE_SIZE") {
      error = new ApiError(400, "File size too large");
    } else {
      error = new ApiError(400, err.message);
    }
  } else if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };
  return res.status(error.statusCode).json(response);
};

export { errorHandler };
