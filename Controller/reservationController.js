import "express-async-errors";
import reservationModel from "../models/reservationModel.js";
import { StatusCodes } from "http-status-codes";
import { getVacantSlotId, updateSlotStatus } from "./slotController.js";
import { getPlotByIdPassed } from "./plotController.js";
import { BadRequestError } from "../Errors/customErrors.js";

export const getReservationBySlotId = async (req, res) => {
  const reservations = await reservationModel.find({ slotId: req.params.id });
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
  console.log(vacantSlotId);
  if (!vacantSlotId)
    throw new BadRequestError("No vacant Spots for given Plot");
  const reservation = await reservationModel.create({
    slotId: vacantSlotId,
    userId: req.user.userId,
    price: plot.pricePerUnit,
    parkingTime: currTime,
    leavingTime: "",
  });
  await updateSlotStatus(vacantSlotId, "occupied");
  res
    .status(StatusCodes.OK)
    .json({ message: "reservation created", reservation });
};

const getReservationsBySlotIdPassed = async (slotId) => {
  return await reservationModel.find({ slotId });
};

export const releaseParkingSpot = async (req, res) => {
  const reservation = (await getReservationsBySlotIdPassed(req.params.id)).at(
    -1
  );
  if (!reservation || reservation.leavingTime !== "")
    throw new BadRequestError("No active reservation found");
  const updatedReservation = await reservationModel.findByIdAndUpdate(
    reservation._id,
    {
      leavingTime: new Date(Date.now()).toISOString(),
    },
    { new: true }
  );
  await updateSlotStatus(reservation.slotId, "vacant");
  res
    .status(StatusCodes.OK)
    .json({ message: "released Spot", updatedReservation });
};

export const totalRevenue = async () => {
  return (await reservationModel.find({})).reduce(
    (rev, cur) => rev + cur.price,
    0
  );
};
