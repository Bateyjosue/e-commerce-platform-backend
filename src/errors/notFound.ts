import CustomErrorApi from "./customApiError";
import { StatusCodes } from "http-status-codes";

class NotFoundError extends CustomErrorApi {
  statusCode: StatusCodes;
  success: boolean;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.success = false;
  }
}

export default NotFoundError;
