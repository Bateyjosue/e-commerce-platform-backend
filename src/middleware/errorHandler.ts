import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendErrorResponse } from "../utils/response";

interface ErrorHandle extends Error {
  statusCode: StatusCodes;
  message: string;
  code: number;
  keyValue: object;
  errors: any; // Mongoose errors can have various structures
  value: string;
}

// Define a type for Mongoose validation error items
interface MongooseValidationError {
  message: string;
}

function errorHandler(
  err: ErrorHandle,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong, please try again later.";
  let genericMessage = "An error occurred";

  if (err.name === "ValidationError") {
    // Mongoose validation errors
    const validationErrors = (Object.values(err.errors) as MongooseValidationError[]).map(
      (item) => item.message,
    );
    statusCode = StatusCodes.BAD_REQUEST;
    genericMessage = "Validation failed";
    // Send multiple error messages if they exist
    return sendErrorResponse(res, genericMessage, validationErrors, statusCode);
  } else if (err.code && err.code === 11000) {
    // Mongoose duplicate key error
    message = `The value '${Object.values(err.keyValue)[0]}' for the field '${Object.keys(err.keyValue)[0]}' already exists.`;
    statusCode = StatusCodes.BAD_REQUEST;
    genericMessage = "Duplicate field value";
  } else if (err.name === "CastError") {
    // Mongoose cast error (e.g., invalid ObjectId)
    message = `Invalid format for ID: ${err.value}`;
    statusCode = StatusCodes.BAD_REQUEST;
    genericMessage = "Invalid ID format";
  }

  // For all other errors
  sendErrorResponse(res, genericMessage, [message], statusCode);
}

export default errorHandler;
