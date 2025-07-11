import { Router } from "express";
const router = Router();

import {
  register,
  login,
  logout,
  getAllUsers,
} from "../Controller/authController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validationMiddleware.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleware.js";

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);
router.post("/logout", logout);
router.get(
  "/users",
  authenticateUser,
  authorizePermissions("admin"),
  getAllUsers
);

export default router;
