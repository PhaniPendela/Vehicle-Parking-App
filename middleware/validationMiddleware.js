import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../Errors/customErrors.js";
import userModel from "../models/userModel.js";
import plotModel from "../models/plotModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("Not authorized"))
          throw new UnauthorizedError(errorMessages);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const plot = await plotModel.findById(value);
    if (!plot) throw new NotFoundError(`no plot with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    if (!isAdmin) throw new Error("Not authorized to access this route");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await userModel.findOne({ email });
      if (user) {
        throw new BadRequestError("Email already exits");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 charecters long"),
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
    .withMessage("Prime Location Name needed"),
  body("address").notEmpty().withMessage("address needed"),
  body("pinCode").notEmpty().withMessage("pin code needed"),
  body("pricePerUnit")
    .notEmpty()
    .withMessage("price per unit needed")
    .bail()
    .custom((value) => {
      const parsedNumber = Number.parseFloat(value);
      if (
        Number.isNaN(parsedNumber) ||
        !/^\d*\.?\d+$/.test(value.toString().trim())
      )
        throw new BadRequestError("Invalid price");
      return true;
    }),
  body("numUnits")
    .notEmpty()
    .withMessage("no of units needed")
    .bail()
    .custom((value) => {
      const parsedNumber = Number.parseInt(value, 10);
      if (Number.isNaN(parsedNumber) || !/^\d+$/.test(value.toString().trim()))
        throw new BadRequestError("Invalid number of units");
      return true;
    }),
]);
