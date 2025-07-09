import "express-async-errors";
import reservationModel from "../models/reservationModel.js";
import { StatusCodes } from "http-status-codes";
import { getVacantSlotId } from "./slotController.js";
import { getPlotByIdPassed } from "./plotController.js";
import { BadRequestError } from "../Errors/customErrors.js";

export const getReservationBySlotId = async (req, res) => {
  const reservations = await reservationModel.find({ slotId: req.params.id });
  console.log(reservations);
  res
    .status(StatusCodes.OK)
    .json({ message: "Retreived", reservation: reservations.at(-1) });
};

export const getReservationByUserId = async (req, res) => {
  const reservations = await reservationModel.find({ userId: req.params.id });
  res.status(StatusCodes.OK).json({ message: "Retreived", reservations });
};

export const reserveParkingSpot = async (req, res) => {
  const { id } = req.params;
  const plot = await getPlotByIdPassed(id);
  const currTime = new Date(Date.now()).toISOString();
  const vacantSlotId = await getVacantSlotId(id);
  if (!vacantSlotId)
    throw new BadRequestError("No vacant Spots for given Plot");
  const reservation = await reservationModel.create({
    slotId: vacantSlotId,
    userId: req.user.userId,
    price: plot.pricePerUnit,
    parkingTime: currTime,
    leavingTime: "",
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "reservation created", reservation });
};
