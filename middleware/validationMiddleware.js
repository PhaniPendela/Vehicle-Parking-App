import { body, validationResult } from "express-validator";
import { BadRequestError } from "../Errors/customErrors.js";
import User from "../models/User.js";
import Plot from "../models/Plot.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateRegisterInput = withValidationErrors([
  body("fullName")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("Email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
]);

export const validatePlotInput = withValidationErrors([
  body("primeLocationName")
    .notEmpty()
    .withMessage("Prime location name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("pinCode")
    .notEmpty()
    .withMessage("Pin code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Pin code must be 6 digits")
    .isNumeric()
    .withMessage("Pin code must contain only numbers"),
  body("pricePerUnit")
    .notEmpty()
    .withMessage("Price per unit is required")
    .isNumeric()
    .withMessage("Price per unit must be a number")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Price per unit cannot be negative");
      }
      return true;
    }),
  body("numUnits")
    .notEmpty()
    .withMessage("Number of units is required")
    .isInt({ min: 1 })
    .withMessage("Number of units must be at least 1"),
]);

export const validatePlotIdParam = withValidationErrors([
  body("plotId").custom(async (value, { req }) => {
    const plotId = req.params.id || value;
    const plot = await Plot.findById(plotId);
    if (!plot) {
      throw new Error("Plot not found");
    }
  }),
]);
