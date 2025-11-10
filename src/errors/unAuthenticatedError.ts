import { StatusCodes } from "http-status-codes";
import CustomErrorApi from "./customApiError";

class UnAuthenticatedError extends CustomErrorApi {
  statusCode: StatusCodes;
  success: boolean;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.success = false;
  }
}

export default UnAuthenticatedError;
