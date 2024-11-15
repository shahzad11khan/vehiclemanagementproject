import mongoose from "mongoose";

const VehicleMOTSchema = new mongoose.Schema(
  {
    VehicleName: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    motCurrentDate: {
      type: Date,
      default: "",
    },
    motDueDate: {
      type: Date,
      default: "",
    },
    motCycle: {
      type: String,
    },
    motPending_Done: {
      type: String,
    },
    motStatus: {
      type: String,
      // default: "active",
    },
    VehicleStatus: {
      type: Boolean,
    },
    VehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
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

export default mongoose.models.VehicleMOT ||
  mongoose.model("VehicleMOT", VehicleMOTSchema);
