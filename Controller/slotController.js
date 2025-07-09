import "express-async-errors";
import slotModel from "../models/slotModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllSlots = async (req, res) => {
  const slots = await slotModel.find({ parentId: req.params.id });
  res.status(StatusCodes.OK).json({ slots });
};

export const deleteSlotById = async (req, res) => {
  const matchedSlot = await slotModel.findByIdAndDelete(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ message: "Slot deleted successfully", matchedSlot });
};

export const updateSlotStatus = async (slotId, slotStatus) => {
  const updatedSlot = await slotModel.findByIdAndUpdate(
    slotId,
    { status: slotStatus },
    { new: true }
  );
  return updatedSlot;
};

export const createSlot = async (parentId) => {
  const slot = await slotModel.create({ parentId });
  return slot;
};
