import "express-async-errors";
import { StatusCodes } from "http-status-codes";
import plotModel from "../models/plotModel.js";
import { createSlot, updateSlotStatus } from "./slotController.js";

export const getAllPlots = async (req, res) => {
  const plots = await plotModel.find({});
  res.status(StatusCodes.OK).json({ plots });
};

export const createPlot = async (req, res) => {
  const plot = await plotModel.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Plot Created", plot, slot, updatedSlot });
};

export const getPlotById = async (req, res) => {
  const plot = await plotModel.findById(req.params.id);
  res.status(StatusCodes.OK).json({ plot });
};

export const updatePlotById = async (req, res) => {
  const updatedPlot = await plotModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res
    .status(StatusCodes.OK)
    .json({ message: "Plot detailed updated", updatedPlot });
};

export const deletePlotById = async (req, res) => {
  const matchedPlot = await plotModel.findByIdAndDelete(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ message: "Plot deleted successfully", matchedPlot });
};
