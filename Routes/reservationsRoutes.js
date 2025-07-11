import { Router } from "express";
const router = Router();

import {
  createReservation,
  getAllReservations,
  getUserReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  completeReservation,
} from "../Controller/reservationsController.js";

import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllReservations);

router.route("/user/:userId").get(authenticateUser, getUserReservations);

router.route("/:plotId").post(authenticateUser, createReservation);

router
  .route("/:id")
  .get(authenticateUser, getReservation)
  .put(authenticateUser, updateReservation)
  .delete(authenticateUser, cancelReservation);

router.patch("/:id/complete", authenticateUser, completeReservation);
router.patch("/:id/cancel", authenticateUser, cancelReservation);

export default router;
