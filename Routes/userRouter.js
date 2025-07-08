import { Router } from "express";
import {
  getApplicationStats,
  getCurrentUser,
} from "../controller/userController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);

export default router;
