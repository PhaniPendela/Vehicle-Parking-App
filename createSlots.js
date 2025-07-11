// Script to create slots for existing plot
import mongoose from "mongoose";
import dotenv from "dotenv";
import Slot from "./models/Slot.js";

dotenv.config();

const createSlotsForExistingPlot = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Plot ID from the test
    const plotId = "686f31cc567fd933d88b3464";
    const numUnits = 2;

    // Create slots for the plot
    const slots = [];
    for (let i = 1; i <= numUnits; i++) {
      slots.push({
        plotId: plotId,
        slotNumber: i,
        status: "vacant",
      });
    }

    await Slot.insertMany(slots);
    console.log(`Created ${numUnits} slots for plot ${plotId}`);

    // Verify slots were created
    const createdSlots = await Slot.find({ plotId });
    console.log("Created slots:", createdSlots);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createSlotsForExistingPlot();
