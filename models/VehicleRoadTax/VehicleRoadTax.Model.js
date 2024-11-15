import mongoose from "mongoose";

const VehicleroadtexSchema = new mongoose.Schema(
  {
    VehicleName: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    roadtexCurrentDate: {
      type: Date,
    },
    roadtexDueDate: {
      type: Date,
    },
    roadtexCycle: {
      type: String,
    },
    roadtexStatus: {
      type: String,
      // default: "active",
    },
    VehicleStatus: {
      type: Boolean,
    },
    VehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    roadtexPending_Done: {
      type: String,
    },
    adminCreatedBy: {
      type: String,
    },
    adminCompanyName: {
      type: String,
    },
    adminCompanyId: { type: String },
    asignto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.VehicleRoadTax ||
  mongoose.model("VehicleRoadTax", VehicleroadtexSchema);
