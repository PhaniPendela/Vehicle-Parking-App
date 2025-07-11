import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    plotId: {
      type: mongoose.Types.ObjectId,
      ref: "Plot",
      required: [true, "Please provide plot ID"],
    },
    slotNumber: {
      type: Number,
      required: [true, "Please provide slot number"],
    },
    status: {
      type: String,
      enum: ["occupied", "vacant"],
      default: "vacant",
    },
    occupiedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique slot numbers per plot
SlotSchema.index({ plotId: 1, slotNumber: 1 }, { unique: true });

export default mongoose.model("Slot", SlotSchema);
