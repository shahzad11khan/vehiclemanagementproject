// models/EnquiryModel.js
import mongoose from "mongoose";

const DriverMoreInfoSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }, // Reference to the Driver
    vehicle: { type: String },
    paymentcycle: { type: String },
    startDate: { type: Date },
    calculation: { type: Number },
    endDate: { type: String },
    subtractcalculation: { type: Number },
    totalamount: { type: Number },
    totalsubtractamount: { type: Number },
    totalremainingamount: { type: Number },
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
