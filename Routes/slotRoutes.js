import { Router } from "express";
import {
  validateIdParam,
  validateIdParamSlots,
} from "../middleware/validationMiddleware.js";
import { deleteSlotById, getAllSlots } from "../Controller/slotController.js";

const router = Router();

router.get("/:id", validateIdParam, getAllSlots);
router.delete("/:id", validateIdParamSlots, deleteSlotById);

export default router;
