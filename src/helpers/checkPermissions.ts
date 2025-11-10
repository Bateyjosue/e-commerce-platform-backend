/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnAuthorizedError } from "../errors";
import { PayloadUser } from "./token";

const checkPermissions = (requestUser: PayloadUser, resourceUserId: any) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnAuthorizedError("Permission denied to access this route");
};

export default checkPermissions;
