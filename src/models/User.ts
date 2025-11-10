/* eslint-disable @typescript-eslint/no-explicit-any */
import validator from "validator";
import mongoose, { Document } from "mongoose";
import { encryptPassword, isPasswordValid } from "../helpers/passwordEncDec";

export interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  verificationToken: string;
  isVerified: boolean;
  verified: any;
  passwordToken: string;
  passwordTokenExpirationDate: any;
  matchPassword: (encryptedPwd: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDoc>({
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    } as any,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: String,
  passwordTokenExpirationDate: Date,
});

UserSchema.pre<UserDoc>("save", async function () {
  if (!this.isModified("password")) return;
  if (typeof this.password === "string") {
    this.password = await encryptPassword(this.password);
  }
});

UserSchema.methods.matchPassword = async function (encryptPassword: string) {
  return await isPasswordValid(encryptPassword, this.password);
};

export default mongoose.model<UserDoc>("User", UserSchema);
