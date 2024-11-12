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
    },
    motDueDate: {
      type: Date,
    },
    motCycle: {
      type: String,
    },
    motStatus: {
      type: String,
      default: "active",
    },
    adminCreatedBy: {
      type: String,
    },
    adminCompanyName: {
      type: String,
    },
    adminCompanyId: {
      type: String,
    },
    asignto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.VehicleMOT ||
  mongoose.model("VehicleMOT", VehicleMOTSchema);
