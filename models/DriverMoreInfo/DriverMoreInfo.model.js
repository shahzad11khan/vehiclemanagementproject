// models/EnquiryModel.js
import mongoose from "mongoose";

const DriverMoreInfoSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    driverName: { type: String },
    vehicle: { type: String },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    startDate: { type: Date },
    paymentcycle: { type: String },
    payment: { type: Number },
    cost: { type: Number, default: 0 },
    pay: { type: Number, default: 0 },
    endDate: { type: String },
    totalamount: { type: Number, default: 0 },
    totalToremain: { type: Number },
    remaining: { type: Number },
    adminCompanyName: { type: String },
    adminCompanyId: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const DriverMoreInfo =
  mongoose.models.DriverMoreInfo ||
  mongoose.model("DriverMoreInfo", DriverMoreInfoSchema);
export default DriverMoreInfo;
