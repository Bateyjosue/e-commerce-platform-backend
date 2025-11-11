import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors";
import { attachCookiesToResponse } from "../helpers/token";
import crypto from "crypto";
import sendVerifyEmail from "../helpers/sendVerifyEmail";
import hashString from "../helpers/hashString";
import Token from "../models/Token";
import sendResetPasswordEmail from "../helpers/sendResetPasswordEmail";

async function register(req: Request, res: Response) {
  const { email, username, password } = req.body;

  // 1. Password Complexity Validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    throw new BadRequestError(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  // 2. Email Uniqueness Check
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    throw new BadRequestError("Email already exists");
  }

  // 3. Username Validation (Alphanumeric and Uniqueness)
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!username || !usernameRegex.test(username)) {
    throw new BadRequestError("Username must be alphanumeric.");
  }
  const isUsernameExist = await User.findOne({ username });
  if (isUsernameExist) {
    throw new BadRequestError("Username already taken.");
  }


  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    username,
    password,
    email,
    role,
    verificationToken: hashString(verificationToken),
  });

  const originUrl = req.get('origin') || "http://localhost:3000";
  
  // No need to await this, let it run in the background
  sendVerifyEmail({
    username: user.username,
    email: user.email,
    originUrl,
    verificationToken,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    status: StatusCodes.CREATED,
    message:
      "Created successfully, Please check your email to verify your account",
  });
}
async function verifyEmail(req: Request, res: Response) {
  const { email, verificationToken } = req.body;
  if (!email || !verificationToken) {
    throw new BadRequestError(
      "Please provide both values, email and verification token",
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User email does not exist");
  }
  if (user.isVerified) {
    throw new BadRequestError("This user is already verified");
  }
  if (user.verificationToken !== hashString(verificationToken)) {
    throw new UnAuthenticatedError("Token provided is not valid");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email verified" });
}
async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  
  const emailRegex = /\S+@\S+\.\S+/;
  if(!emailRegex.test(email)){
      throw new BadRequestError("Please provide a valid email format");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthenticatedError("Invalid credentials");
  }

  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    throw new UnAuthenticatedError("Invalid credentials");
  }

  const tokenUser = { username: user.username, userId: (user._id as any).toString(), role: user.role };
  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnAuthenticatedError("Invalid credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse(res, tokenUser, refreshToken);
    res.status(StatusCodes.OK).json({
      success: true,
      status: StatusCodes.OK,
      message: "Login successfully",
      user: { ...tokenUser, email: user.email },
    });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };

  await Token.create(userToken);
  attachCookiesToResponse(res, tokenUser, refreshToken);

  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "Login successfully",
    user: { ...tokenUser, email: user.email },
  });
}

async function logout(req: Request, res: Response) {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "logout successfully",
  });
}

async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please email is required");
  }
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    
    const originUrl = req.get('origin') || "http://localhost:3000";
    // No need to await this, let it run in the background
    sendResetPasswordEmail({
      username: user.username,
      email: user.email,
      originUrl,
      verificationToken: passwordToken,
    });

    const twentyMinutes = 1000 * 60 * 20;
    const passwordTokenExpirationDate = new Date(Date.now() + twentyMinutes);

    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }
  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "Please check your email for reset password link",
  });
}
async function resetPassword(req: Request, res: Response) {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    throw new BadRequestError("All fields are required");
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = "";
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "Password reseted successfully",
  });
}
export { register, login, logout, verifyEmail, forgotPassword, resetPassword };