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

export default mongoose.models.VehicleService ||
  mongoose.model("VehicleService", VehicleServiceSchema);
