import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";
import { UnauthenticatedError } from "../Errors/customErrors.js";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = createJWT({ userId: user._id, role: user.role });

  res.status(StatusCodes.CREATED).json({
    msg: "User created successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await comparePasswords(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = createJWT({ userId: user._id, role: user.role });

  res.status(StatusCodes.OK).json({
    msg: "User logged in successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

export const logout = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "User logged out successfully" });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({}, "fullName email role createdAt").sort({
    createdAt: -1,
  });
  res.status(StatusCodes.OK).json(users);
};
