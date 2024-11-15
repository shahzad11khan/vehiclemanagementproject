import mongoose from "mongoose";

const VehicleServiceSchema = new mongoose.Schema(
  {
    VehicleName: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    serviceCurrentDate: {
      type: Date,
    },
    serviceDueDate: {
      type: Date,
    },

    serviceStatus: {
      type: String,
      //   default: "active",
    },
    servicemailes: {
      type: Number,
      //   default: "active",
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
    servicePending_Done: {
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

export default mongoose.models.VehicleService ||
  mongoose.model("VehicleService", VehicleServiceSchema);
