import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../errors";

const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      throw new UnAuthorizedError(
        "Unauthorized to access this Route, Access denied",
      );
    }
    next();
  };
};
export default authorizePermissions;
