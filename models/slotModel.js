import mongoose from "mongoose";

const slotSchema = mongoose.Schema({
  parentId: mongoose.Types.ObjectId,
  status: {
    type: String,
    enum: ["occupied", "vacant"],
    default: "vacant",
  },
});

export default mongoose.model("slot", slotSchema);
