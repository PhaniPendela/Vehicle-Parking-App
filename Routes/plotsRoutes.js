import { Router } from "express";
const router = Router();

import {
  getAllPlots,
  createPlot,
  getPlot,
  updatePlot,
  deletePlot,
} from "../Controller/plotsController.js";

import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleware.js";
import { validatePlotInput } from "../middleware/validationMiddleware.js";

router
  .route("/")
  .get(authenticateUser, getAllPlots)
  .post(
    authenticateUser,
    authorizePermissions("admin"),
    validatePlotInput,
    createPlot
  );

router
  .route("/:id")
  .get(authenticateUser, getPlot)
  .put(authenticateUser, validatePlotInput, updatePlot)
  .delete(authenticateUser, deletePlot);

export default router;
