import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface BaseResponse {
  Success: boolean;
  Message: string;
  Object: any | null;
  Errors: string[] | null;
}

interface PaginatedResponse extends BaseResponse {
  PageNumber?: number;
  PageSize?: number;
  TotalSize?: number;
}

export function sendSuccessResponse(
  res: Response,
  message: string,
  data: any,
  statusCode: StatusCodes = StatusCodes.OK,
) {
  const response: BaseResponse = {
    Success: true,
    Message: message,
    Object: data,
    Errors: null,
  };
  res.status(statusCode).json(response);
}

export function sendPaginatedResponse(
  res: Response,
  message: string,
  data: any[],
  pageNumber: number,
  pageSize: number,
  totalSize: number,
) {
  const response: PaginatedResponse = {
    Success: true,
    Message: message,
    Object: data,
    PageNumber: pageNumber,
    PageSize: pageSize,
    TotalSize: totalSize,
    Errors: null,
  };
  res.status(StatusCodes.OK).json(response);
}

export function sendErrorResponse(
  res: Response,
  message: string,
  errors: string[],
  statusCode: StatusCodes,
) {
  const response: BaseResponse = {
    Success: false,
    Message: message,
    Object: null,
    Errors: errors,
  };
  res.status(statusCode).json(response);
}
