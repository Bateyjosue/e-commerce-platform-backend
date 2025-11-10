import { StatusCodes } from "http-status-codes";
import CustomErrorApi from "./customApiError";

class UnAuthorizedError extends CustomErrorApi {
  statusCode: StatusCodes;
  success: boolean;
  constructor(message: string) {
    super(message);
    (this.statusCode = StatusCodes.FORBIDDEN), (this.success = false);
  }
}

export default UnAuthorizedError;
