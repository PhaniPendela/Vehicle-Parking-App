import { Router } from "express";
const router = Router();

import {
  getSlotsByPlot,
  getSlot,
  updateSlot,
  deleteSlot,
} from "../Controller/slotsController.js";

import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleware.js";

router.route("/plot/:plotId").get(authenticateUser, getSlotsByPlot);

router
  .route("/:id")
  .get(authenticateUser, getSlot)
  .put(authenticateUser, authorizePermissions("admin"), updateSlot)
  .delete(authenticateUser, deleteSlot);

export default router;
