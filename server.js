import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => console.log("Server active"));

app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server is running on ${port}...`);
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}
