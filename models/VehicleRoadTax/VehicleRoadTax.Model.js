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
    adminCreatedBy: {
      type: String,
    },
    adminCompanyName: {
      type: String,
    },
    adminCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    asignto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.VehicleRoadTax ||
  mongoose.model("VehicleRoadTax", VehicleroadtexSchema);
