// models/EnquiryModel.js
import mongoose from "mongoose";

const DriverMoreInfoSchema = new mongoose.Schema(
  {
    driverId: { type: String },
    vehicle: { type: String },
    startDate: { type: Date },
    calculation: { type: Number },
    endDate: { type: Date },
    subtractcalculation: { type: Number },
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
