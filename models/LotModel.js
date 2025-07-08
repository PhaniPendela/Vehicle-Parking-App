import mongoose from "mongoose";

const lotSchema = mongoose.Schema({
  primeLocationName: String,
  price: Number,
  numSlots: Number,
  address: String,
  pinCode: String,
});

export default mongoose.model("lot", lotSchema);
