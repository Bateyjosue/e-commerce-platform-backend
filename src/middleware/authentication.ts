/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { UnAuthenticatedError } from "../errors";
import { attachCookiesToResponse, verifyToken } from "../helpers/token";
import Token from "../models/Token";

const authenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = verifyToken(accessToken) as any;
      req.user = payload.user;
      return next();
    }
    const payload = verifyToken(refreshToken) as any;
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new UnAuthenticatedError("Authentication failed invalid token");
    }
    attachCookiesToResponse(res, payload.user, existingToken.refreshToken);
    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication failed");
  }
};

export default authenticatedUser;
