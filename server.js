import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Routers
import authRouter from "./Routes/authRoutes.js";
import plotsRouter from "./Routes/plotsRoutes.js";
import slotsRouter from "./Routes/slotsRoutes.js";
import reservationsRouter from "./Routes/reservationsRoutes.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS middleware for development
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/plots", plotsRouter);
app.use("/api/v1/slots", slotsRouter);
app.use("/api/v1/reservations", reservationsRouter);

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "./public", "index.html"))
);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handling middleware
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
