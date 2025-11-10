/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors";
import { Response } from "express";

const { JWT_SECRET_KEY } = process.env;
export interface PayloadUser {
  userId: string;
  username: string;
  role: string;
}
const generateToken = ({ payload }: any): string => {
  if (typeof JWT_SECRET_KEY !== "string")
    throw new BadRequestError("JWT secret key must be provided");
  const token = jwt.sign(payload, JWT_SECRET_KEY);
  return token;
};

const verifyToken = (token: string) => {
  if (typeof JWT_SECRET_KEY !== "string")
    throw new BadRequestError("JWT secret key must be provided");
  return jwt.verify(token, JWT_SECRET_KEY);
};

const attachCookiesToResponse = (
  res: Response,
  user: PayloadUser,
  refreshToken: string,
) => {
  const accessTokenJWT = generateToken({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const largeExpiration = 1000 * 60 * 60 * 24 * 30;

  const refreshTokenJWT = generateToken({ payload: { user, refreshToken } });
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV !== "production",
    signed: true,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + largeExpiration),
    secure: process.env.NODE_ENV !== "production",
    signed: true,
  });
};
export { generateToken, verifyToken, attachCookiesToResponse }
