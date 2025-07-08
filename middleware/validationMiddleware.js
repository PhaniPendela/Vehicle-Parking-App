import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../Errors/customErrors.js";
import userModel from "../models/userModel.js";

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
    const job = await jobModel.findById(value);
    if (!job) throw new NotFoundError(`no job with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new Error("Not authorized to access this route");
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
