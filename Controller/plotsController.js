import { StatusCodes } from "http-status-codes";
import Plot from "../models/Plot.js";
import Slot from "../models/Slot.js";
import { NotFoundError, UnauthorizedError } from "../Errors/customErrors.js";

export const getAllPlots = async (req, res) => {
  const plots = await Plot.find({}).populate("createdBy", "fullName email");
  res.status(StatusCodes.OK).json(plots);
};

export const createPlot = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const plot = await Plot.create(req.body);

  // Create slots for the plot
  const slots = [];
  for (let i = 1; i <= plot.numUnits; i++) {
    slots.push({
      plotId: plot._id,
      slotNumber: i,
      status: "vacant",
    });
  }

  await Slot.insertMany(slots);

  res.status(StatusCodes.CREATED).json(plot);
};

export const getPlot = async (req, res) => {
  const { id } = req.params;

  const plot = await Plot.findById(id).populate("createdBy", "fullName email");

  if (!plot) {
    throw new NotFoundError(`No plot with id ${id}`);
  }

  res.status(StatusCodes.OK).json(plot);
};

export const updatePlot = async (req, res) => {
  const { id } = req.params;

  const plot = await Plot.findById(id);

  if (!plot) {
    throw new NotFoundError(`No plot with id ${id}`);
  }

  // Check if user is admin or plot owner
  if (
    req.user.role !== "admin" &&
    plot.createdBy.toString() !== req.user.userId
  ) {
    throw new UnauthorizedError("Not authorized to update this plot");
  }

  const updatedPlot = await Plot.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json(updatedPlot);
};

export const deletePlot = async (req, res) => {
  const { id } = req.params;

  const plot = await Plot.findById(id);

  if (!plot) {
    throw new NotFoundError(`No plot with id ${id}`);
  }

  // Check if user is admin or plot owner
  if (
    req.user.role !== "admin" &&
    plot.createdBy.toString() !== req.user.userId
  ) {
    throw new UnauthorizedError("Not authorized to delete this plot");
  }

  // Delete associated slots
  await Slot.deleteMany({ plotId: id });

  await Plot.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ msg: "Plot deleted successfully" });
};
