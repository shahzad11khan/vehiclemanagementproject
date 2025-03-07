import mongoose from "mongoose";

const DriverVehicleAllotmentInfoSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    driverName: { type: String },
    startDate: { type: Date },
    taxifirm: { type: String },
    taxilocalauthority: { type: String },
    vehicle: { type: String },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    registrationNumber: { type:String},
    paymentcycle: { type: String },
    payment: { type: Number },
    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
    adminCompanyId: { type: String },
  },
  {
    timestamps: true,
  }
);
const DriverVehicleAllotment =
  mongoose.models.DriverVehicleAllotment ||
  mongoose.model("DriverVehicleAllotment", DriverVehicleAllotmentInfoSchema);
export default DriverVehicleAllotment;
