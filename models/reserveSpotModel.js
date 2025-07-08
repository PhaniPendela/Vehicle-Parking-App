import mongoose from "mongoose";

const reserveSlotSchema = mongoose.Schema({
  spotId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  cost: Number,
  parkingTimestamp: String,
  leavingTimestamp: String,
});

export default mongoose.model("log", reserveSlotSchema);
