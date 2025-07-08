import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  statusCode = StatusCodes.NOT_FOUND;
  name = "NotFoundError";
  constructor(message) {
    super(message);
  }
}

export class BadRequestError extends Error {
  statusCode = StatusCodes.BAD_REQUEST;
  name = "BadRequestError";
  constructor(message) {
    super(message);
  }
}

export class UnauthenticatedError extends Error {
  statusCode = StatusCodes.UNAUTHORIZED;
  name = "UnauthenticatedError";
  constructor(message) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  statusCode = StatusCodes.FORBIDDEN;
  name = "UnauthorizedError";
  constructor(message) {
    super(message);
  }
}
