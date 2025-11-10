import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

function notFoundMiddleware(req: Request, res: Response) {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    status: StatusCodes.NOT_FOUND,
    message: `Route provided: ${req.method} = ${req.protocol}://${req.headers.host}${req.originalUrl} is not found`,
  });
}
export default notFoundMiddleware;
