import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors";

import checkPermissions from "../helpers/checkPermissions";

async function getSingleUser(req: Request, res: Response) {
  const { id } = req.params;

  const user = await User.findOne({ _id: id, role: "user" }).select(
    "-password",
  );

  if (!user) {
    throw new NotFoundError(`No user found with id ${id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "User retrieved successfully",
    user,
  });
}

async function getAllUsers(req: Request, res: Response) {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "Users retrieved successfully",
    users,
  });
}

async function showCurrentUser(req: Request, res: Response) {
  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "Current user retrieved successfully",
    user: { ...req.user },
  });
}

async function updateUser(req: Request, res: Response) {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new BadRequestError("Please provide both username and email");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { username, email },
    { new: true, runValidators: true },
  ).select("-password");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "User updated successfully",
    user: { user },
  });
}

async function updateUserPassword(req: Request, res: Response) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide both old and new password");
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (user !== null) {
    const isPasswordValid = await user.matchPassword(oldPassword);

    if (!isPasswordValid) {
      throw new UnAuthenticatedError("Invalid credentials");
    }

    user.password = newPassword;
    await user.save();
  }
  res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: "User Password updated successfully",
  });
}

export {
  getSingleUser,
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
