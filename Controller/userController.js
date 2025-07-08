import { StatusCodes } from "http-status-codes";
import userModel from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  const user = await userModel.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
export const getApplicationStats = async (req, res) => {
  const users = await userModel.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};
