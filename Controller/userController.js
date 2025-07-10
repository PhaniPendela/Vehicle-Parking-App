import "express-async-errors";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/userModel.js";
import { totalRevenue } from "./reservationController.js";
import { totalOccupancy } from "./plotController.js";

export const getCurrentUser = async (req, res) => {
  const user = await userModel.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
export const getApplicationStats = async (req, res) => {
  const netRevenue = await totalRevenue();
  const { occupied, vacant } = await totalOccupancy();
  res.status(StatusCodes.OK).json({ netRevenue, occupied, vacant });
};
