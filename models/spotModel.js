import mongoose from "mongoose";
import { SPOT_STATUS } from "../utils/constants.js";

const spotSchema = mongoose.Schema({
  parentPlotId: mongoose.Types.ObjectId,
  status: {
    type: String,
    enum: Object.entries(SPOT_STATUS),
    default: SPOT_STATUS.VACANT,
  },
});

export default mongoose.model("spot", spotSchema);
