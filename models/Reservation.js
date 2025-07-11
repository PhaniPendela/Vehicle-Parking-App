import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user ID"],
    },
    plotId: {
      type: mongoose.Types.ObjectId,
      ref: "Plot",
      required: [true, "Please provide plot ID"],
    },
    slotId: {
      type: mongoose.Types.ObjectId,
      ref: "Slot",
      required: [true, "Please provide slot ID"],
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reservation", ReservationSchema);
