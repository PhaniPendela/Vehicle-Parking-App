import { StatusCodes } from "http-status-codes";
import Slot from "../models/Slot.js";
import Plot from "../models/Plot.js";
import { NotFoundError, UnauthorizedError } from "../Errors/customErrors.js";

export const getSlotsByPlot = async (req, res) => {
  const { plotId } = req.params;

  const plot = await Plot.findById(plotId);
  if (!plot) {
    throw new NotFoundError(`No plot with id ${plotId}`);
  }

  const slots = await Slot.find({ plotId }).populate(
    "occupiedBy",
    "fullName email"
  );
  res.status(StatusCodes.OK).json(slots);
};

export const getSlot = async (req, res) => {
  const { id } = req.params;

  const slot = await Slot.findById(id).populate("plotId occupiedBy");

  if (!slot) {
    throw new NotFoundError(`No slot with id ${id}`);
  }

  res.status(StatusCodes.OK).json(slot);
};

export const updateSlot = async (req, res) => {
  const { id } = req.params;

  const slot = await Slot.findById(id);

  if (!slot) {
    throw new NotFoundError(`No slot with id ${id}`);
  }

  const updatedSlot = await Slot.findByIdAndUpdate(id, req.body, {
    new: true,
  }).populate("plotId occupiedBy");

  res.status(StatusCodes.OK).json(updatedSlot);
};

export const deleteSlot = async (req, res) => {
  const { id } = req.params;

  const slot = await Slot.findById(id).populate("plotId");

  if (!slot) {
    throw new NotFoundError(`No slot with id ${id}`);
  }

  // Check if user is admin or plot owner
  const plot = slot.plotId;
  if (
    req.user.role !== "admin" &&
    plot.createdBy.toString() !== req.user.userId
  ) {
    throw new UnauthorizedError("Not authorized to delete this slot");
  }

  // Delete the slot
  await Slot.findByIdAndDelete(id);

  // Update the plot's numUnits count
  const remainingSlots = await Slot.countDocuments({ plotId: plot._id });
  await Plot.findByIdAndUpdate(plot._id, { numUnits: remainingSlots });

  res.status(StatusCodes.OK).json({ msg: "Slot deleted successfully" });
};
