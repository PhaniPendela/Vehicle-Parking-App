import { Router } from "express";
import {
  getReservationBySlotId,
  getReservationByUserId,
  releaseParkingSpot,
  reserveParkingSpot,
} from "../Controller/reservationController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:id", [authorizePermissions("admin"), getReservationBySlotId]);
router.get("/users/:id", getReservationByUserId);
router.post("/:id", reserveParkingSpot);
router.post("/release/:id", releaseParkingSpot);

export default router;
