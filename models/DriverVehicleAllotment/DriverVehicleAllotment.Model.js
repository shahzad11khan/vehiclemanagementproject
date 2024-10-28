// models/EnquiryModel.js
import mongoose from "mongoose";

const DriverVehicleAllotmentInfoSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    driverName: { type: String },
    startDate: { type: String },
    taxifirm: { type: String },
    taxilocalauthority: { type: String },
    vehicle: { type: String },
    paymentcycle: { type: String },
    payment: { type: Number },
    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
  },
  {
    timestamps: true,
  }
);
const DriverVehicleAllotment =
  mongoose.models.DriverVehicleAllotment ||
  mongoose.model("DriverVehicleAllotment", DriverVehicleAllotmentInfoSchema);
export default DriverVehicleAllotment;
