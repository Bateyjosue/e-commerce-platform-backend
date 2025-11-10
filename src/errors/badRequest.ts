import { StatusCodes } from "http-status-codes";
import CustomErrorApi from "./customApiError";

class BadRequestError extends CustomErrorApi {
  statusCode: StatusCodes;
  success: boolean;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.success = false;
  }
}

export default BadRequestError;
