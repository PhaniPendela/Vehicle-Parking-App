import mongoose from "mongoose";

const plotSchema = mongoose.Schema({
  primeLocationName: String,
  address: String,
  pinCode: String,
  pricePerUnit: String,
  numUnits: String,
});

export default mongoose.model("plot", plotSchema);
