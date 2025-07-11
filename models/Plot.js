import mongoose from "mongoose";

const PlotSchema = new mongoose.Schema(
  {
    primeLocationName: {
      type: String,
      required: [true, "Please provide prime location name"],
      maxlength: 100,
    },
    address: {
      type: String,
      required: [true, "Please provide address"],
      maxlength: 200,
    },
    pinCode: {
      type: String,
      required: [true, "Please provide pin code"],
      match: [/^\d{6}$/, "Please provide a valid 6-digit pin code"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Please provide price per unit"],
      min: [0, "Price cannot be negative"],
    },
    numUnits: {
      type: Number,
      required: [true, "Please provide number of units"],
      min: [1, "Must have at least 1 unit"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Plot", PlotSchema);
