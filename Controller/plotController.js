import "express-async-errors";
import { StatusCodes } from "http-status-codes";
import plotModel from "../models/plotModel.js";
import {
  createSlot,
  deleteAllSlots,
  isVacant,
  updateSlotStatus,
} from "./slotController.js";
import { BadRequestError } from "../Errors/customErrors.js";

export const getAllPlots = async (req, res) => {
  const plots = await plotModel.find({});
  res.status(StatusCodes.OK).json({ plots });
};

export const createPlot = async (req, res) => {
  const { primeLocationName, address, pinCode, pricePerUnit, numUnits } =
    req.body;
  const plot = await plotModel.create({
    primeLocationName,
    address,
    pinCode,
    pricePerUnit: +pricePerUnit,
    numUnits: +numUnits,
    numOccupied: 0,
    numVacant: +numUnits,
  });
  for (let i = 0; i < +numUnits; i++) {
    await createSlot(plot._id);
  }
  res.status(StatusCodes.CREATED).json({ message: "Plot Created", plot });
};

export const getPlotById = async (req, res) => {
  const plot = await plotModel.findById(req.params.id);
  res.status(StatusCodes.OK).json({ plot });
};

export const updatePlotById = async (req, res) => {
  const { primeLocationName, address, pinCode, pricePerUnit } = req.body;
  const updatedPlot = await plotModel.findByIdAndUpdate(
    req.params.id,
    {
      primeLocationName,
      address,
      pinCode,
      pricePerUnit: +pricePerUnit,
    },
    { new: true }
  );
  res
    .status(StatusCodes.OK)
    .json({ message: "Plot detailed updated", updatedPlot });
};

export const deletePlotById = async (req, res) => {
  const isVacantPlot = await isVacant(req.params.id);
  if (!isVacantPlot) throw new BadRequestError("Plot is not vacant");
  const matchedPlot = await plotModel.findByIdAndDelete(req.params.id);
  await deleteAllSlots(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ message: "Plot deleted successfully", matchedPlot });
};

export const getPlotByIdPassed = async (id) => {
  const plot = await plotModel.findById(id);
  return plot;
};

export const updatePlotSlots = async (type, id) => {
  const plot = await getPlotByIdPassed(id);
  await plotModel.findByIdAndUpdate(
    id,
    {
      numUnits: type === "delete" ? plot.numUnits - 1 : plot.numUnits,
      numOccupied:
        type === "occupied"
          ? plot.numOccupied + 1
          : type === "vacant"
          ? plot.numOccupied - 1
          : plot.numOccupied,
      numVacant: type === "vacant" ? plot.numVacant + 1 : plot.numVacant - 1,
    },
    { new: true }
  );
};

export const totalOccupancy = async () => {
  return (await plotModel.find({})).reduce(
    (occ, cur) => {
      occ.occupied += cur.numOccupied;
      occ.vacant += cur.numVacant;
      return occ;
    },
    { occupied: 0, vacant: 0 }
  );
};
