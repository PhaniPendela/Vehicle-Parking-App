import { StatusCodes } from "http-status-codes";
import userModel from "../models/userModel.js";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../Errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const isFirstUser = (await userModel.countDocuments()) === 0;
  req.body.role = isFirstUser ? "admin" : "user";
  req.body.password = await hashPassword(req.body.password);
  await userModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "User Created" });
};
export const login = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  const isAuthorized =
    user && (await comparePasswords(req.body.password, user.password));
  if (!isAuthorized) throw new UnauthenticatedError("Invalid Credentials");

  const token = createJWT({ userId: user._id, role: user.role });
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ message: "User Logged in" });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out" });
};
