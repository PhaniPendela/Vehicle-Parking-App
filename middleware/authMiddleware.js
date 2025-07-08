import { UnauthenticatedError } from "../Errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("Authentication Invalid");
  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError("Unauthorized to access this route");
    next();
  };
};
