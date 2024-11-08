// models/VehicleRepair.js
import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    images: [
      {
        url: { type: String }, // Cloudinary URL
        public_id: { type: String }, // Cloudinary public ID
      },
    ],
    organisation: {
      type: String,
    },
    repairStatus: {
      type: String,
    },
    jobNumber: {
      type: String,
    },
    memo: {
      type: String,
      required: false,
    },

    labourHours: {
      type: Number,
    },
    cost: {
      type: Number,
    },
    signedOffBy: {
      type: String,
    },
    date: {
      type: Date,
    },

    issues: {
      type: String,
    },
    vehicleName: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    repairHistory: {
      parts: [
        {
          partNumber: { type: String },
          partName: { type: String },
          price: { type: Number },
          supplier: { type: String },
        },
      ],
    },
    adminCreatedBy: {
      type: String,
    },
    adminCompanyName: {
      type: String,
    },
    adminCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.models.VehicleRepair ||
  mongoose.model("VehicleRepair", repairSchema);
