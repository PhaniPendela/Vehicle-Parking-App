import { Router } from "express";
import {
  createPlot,
  deletePlotById,
  getAllPlots,
  getPlotById,
  updatePlotById,
} from "../Controller/plotController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";
import {
  validateIdParam,
  validatePlotInput,
} from "../middleware/validationMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getAllPlots)
  .post(validatePlotInput, [authorizePermissions("admin"), createPlot]);

router
  .route("/:id")
  .get(validateIdParam, getPlotById)
  .patch(validatePlotInput, validateIdParam, updatePlotById)
  .delete(validateIdParam, deletePlotById);

export default router;
