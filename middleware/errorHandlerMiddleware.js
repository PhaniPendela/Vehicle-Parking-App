import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong, Please try again";

  res.status(status).json({ message });
};

export default errorHandlerMiddleware;
