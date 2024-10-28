// models/EnquiryModel.js
import mongoose from "mongoose";

const DriverMoreInfoSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }, // Reference to the Driver
    vehicle: { type: String },
    paymentcycle: { type: String },
    startDate: { type: String },
    driverName: { type: String },
    payment: { type: Number },
    endDate: { type: String, defult: null },
    remaining: { type: Number },
    adminCompanyName: { type: String },
    adminCreatedBy: { type: String },
    adminCompanyId: { type: String },
  },
  {
    timestamps: true,
  }
);

const DriverMoreInfo =
  mongoose.models.DriverMoreInfo ||
  mongoose.model("DriverMoreInfo", DriverMoreInfoSchema);
export default DriverMoreInfo;
