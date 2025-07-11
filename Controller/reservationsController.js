import { StatusCodes } from "http-status-codes";
import Reservation from "../models/Reservation.js";
import Slot from "../models/Slot.js";
import Plot from "../models/Plot.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../Errors/customErrors.js";

export const createReservation = async (req, res) => {
  const { plotId } = req.params;
  const { userId } = req.body;

  // Check if plot exists
  const plot = await Plot.findById(plotId);
  if (!plot) {
    throw new NotFoundError(`No plot with id ${plotId}`);
  }

  // Find an available slot
  const availableSlot = await Slot.findOne({ plotId, status: "vacant" });
  if (!availableSlot) {
    throw new BadRequestError("No available slots in this plot");
  }

  // Create reservation
  const reservation = await Reservation.create({
    userId: userId || req.user.userId,
    plotId,
    slotId: availableSlot._id,
    status: "active",
  });

  // Update slot status
  await Slot.findByIdAndUpdate(availableSlot._id, {
    status: "occupied",
    occupiedBy: userId || req.user.userId,
  });

  const populatedReservation = await Reservation.findById(reservation._id)
    .populate("userId", "fullName email")
    .populate({
      path: "plotId",
      select: "primeLocationName address pinCode pricePerUnit numUnits",
    })
    .populate("slotId");

  // Transform the response to match frontend expectations
  const responseReservation = {
    ...populatedReservation.toObject(),
    plot: populatedReservation.plotId,
    user: populatedReservation.userId,
    plotId: populatedReservation.plotId._id,
    userId: populatedReservation.userId._id,
  };

  res.status(StatusCodes.CREATED).json(responseReservation);
};

export const getAllReservations = async (req, res) => {
  const reservations = await Reservation.find({})
    .populate("userId", "fullName email")
    .populate({
      path: "plotId",
      select: "primeLocationName address pinCode pricePerUnit numUnits",
    })
    .populate("slotId")
    .sort({ createdAt: -1 });

  // Transform the response to match frontend expectations
  const transformedReservations = reservations.map((reservation) => ({
    ...reservation.toObject(),
    plot: reservation.plotId,
    user: reservation.userId,
    plotId: reservation.plotId?._id,
    userId: reservation.userId?._id,
  }));

  res.status(StatusCodes.OK).json(transformedReservations);
};

export const getUserReservations = async (req, res) => {
  const { userId } = req.params;

  // Check if user is requesting their own reservations or is admin
  if (req.user.userId !== userId && req.user.role !== "admin") {
    throw new UnauthorizedError("Not authorized to view these reservations");
  }

  const reservations = await Reservation.find({ userId })
    .populate("userId", "fullName email")
    .populate({
      path: "plotId",
      select: "primeLocationName address pinCode pricePerUnit numUnits",
    })
    .populate("slotId")
    .sort({ createdAt: -1 });

  // Transform the response to match frontend expectations
  const transformedReservations = reservations.map((reservation) => ({
    ...reservation.toObject(),
    plot: reservation.plotId,
    user: reservation.userId,
    plotId: reservation.plotId?._id,
    userId: reservation.userId?._id,
  }));

  res.status(StatusCodes.OK).json(transformedReservations);
};

export const getReservation = async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id)
    .populate("userId", "fullName email")
    .populate({
      path: "plotId",
      select: "primeLocationName address pinCode pricePerUnit numUnits",
    })
    .populate("slotId");

  if (!reservation) {
    throw new NotFoundError(`No reservation with id ${id}`);
  }

  // Check if user owns the reservation or is admin
  if (
    req.user.userId !== reservation.userId._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new UnauthorizedError("Not authorized to view this reservation");
  }

  // Transform the response to match frontend expectations
  const responseReservation = {
    ...reservation.toObject(),
    plot: reservation.plotId,
    user: reservation.userId,
    plotId: reservation.plotId._id,
    userId: reservation.userId._id,
  };

  res.status(StatusCodes.OK).json(responseReservation);
};

export const updateReservation = async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);

  if (!reservation) {
    throw new NotFoundError(`No reservation with id ${id}`);
  }

  // Check if user owns the reservation or is admin
  if (
    req.user.userId !== reservation.userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new UnauthorizedError("Not authorized to update this reservation");
  }

  const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .populate("userId", "fullName email")
    .populate({
      path: "plotId",
      select: "primeLocationName address pinCode pricePerUnit numUnits",
    })
    .populate("slotId");

  // Transform the response to match frontend expectations
  const responseReservation = {
    ...updatedReservation.toObject(),
    plot: updatedReservation.plotId,
    user: updatedReservation.userId,
    plotId: updatedReservation.plotId._id,
    userId: updatedReservation.userId._id,
  };

  res.status(StatusCodes.OK).json(responseReservation);
};

export const cancelReservation = async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);

  if (!reservation) {
    throw new NotFoundError(`No reservation with id ${id}`);
  }

  // Check if user owns the reservation or is admin
  if (
    req.user.userId !== reservation.userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new UnauthorizedError("Not authorized to cancel this reservation");
  }

  // Update reservation status
  await Reservation.findByIdAndUpdate(id, {
    status: "cancelled",
    endTime: new Date(),
  });

  // Free up the slot
  await Slot.findByIdAndUpdate(reservation.slotId, {
    status: "vacant",
    occupiedBy: null,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Reservation cancelled successfully" });
};

export const completeReservation = async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);

  if (!reservation) {
    throw new NotFoundError(`No reservation with id ${id}`);
  }

  // Check if user owns the reservation or is admin
  if (
    req.user.userId !== reservation.userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new UnauthorizedError("Not authorized to complete this reservation");
  }

  // Update reservation status
  await Reservation.findByIdAndUpdate(id, {
    status: "completed",
    endTime: new Date(),
  });

  // Free up the slot
  await Slot.findByIdAndUpdate(reservation.slotId, {
    status: "vacant",
    occupiedBy: null,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Reservation completed successfully" });
};
