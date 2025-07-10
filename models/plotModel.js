import mongoose from "mongoose";

const plotSchema = mongoose.Schema({
  primeLocationName: String,
  address: String,
  pinCode: String,
  pricePerUnit: Number,
  numUnits: Number,
  numOccupied: Number,
  numVacant: Number,
});

export default mongoose.model("plot", plotSchema);
