import "express-async-errors";
import slotModel from "../models/slotModel.js";
import { StatusCodes } from "http-status-codes";
import { updatePlotSlots } from "./plotController.js";

export const getAllSlots = async (req, res) => {
  const slots = await slotModel.find({ parentId: req.params.id });
  res.status(StatusCodes.OK).json({ slots });
};

export const deleteSlotById = async (req, res) => {
  const matchedSlot = await slotModel.findByIdAndDelete(req.params.id);
  await updatePlotSlots("delete", matchedSlot.parentId);
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
  await updatePlotSlots(slotStatus, updatedSlot.parentId);
};

export const createSlot = async (parentId) => {
  const slot = await slotModel.create({ parentId });
};

export const getVacantSlotId = async (parentId) => {
  const slot = await slotModel.find({ parentId });
  const vacantSlot = slot.filter((slot) => slot.status === "vacant").at(0);
  return vacantSlot._id;
};

export const isVacant = async (parentId) => {
  const slot = await slotModel.find({ parentId });
  const occupiedSlotIndex = slot.findIndex(
    (slot) => slot.status === "occupied"
  );
  if (occupiedSlotIndex !== -1) return false;
  return true;
};

export const deleteAllSlots = async (parentId) => {
  (await slotModel.find({ parentId }))
    .map((slot) => slot._id)
    .forEach(async (id) => await slotModel.findByIdAndDelete(id));
};
