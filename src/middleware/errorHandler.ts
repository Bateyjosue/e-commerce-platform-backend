import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface ErrorHandle extends Error {
  statusCode: StatusCodes;
  message: string;
  code: number;
  keyValue: object;
  errors: object;
  value: string;
}
function errorHandler(
  err: ErrorHandle,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong, please try again later.",
  };

  if (err.code && err.code === 11000) {
    customError.message = `Duplicate entered for ${Object.keys(
      err.keyValue,
    )}, field please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name && err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(" and ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name && err.name === "CastError") {
    customError.message = `Invalid ID ${err.value} provided`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(customError.statusCode).json({
    success: false,
    status: customError.statusCode,
    message: customError.message,
  });
}
export default errorHandler;
