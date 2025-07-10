import mongoose from "mongoose";

const reservationSchema = mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  slotId: mongoose.Types.ObjectId,
  price: Number,
  parkingTime: String,
  leavingTime: String,
});

export default mongoose.model("reservation", reservationSchema);
