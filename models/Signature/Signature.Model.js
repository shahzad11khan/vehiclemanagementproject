import mongoose from "mongoose";

// Define the schema
const SignatureSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Ensure "Company" is registered
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    imageName: {
      type: String,
      default: "",
    },
    imageFile: {
      type: String, // Store the path or URL of the image file
      default: "",
    },
    imagepublicId: {
      type: String,
      default: "",
    },
    adminCreatedBy: { 
      type: String 
    },
    adminCompanyName: { 
      type: String 
    },
    adminCompanyId: { 
      type: String 
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Ensure the model is only registered once (Next.js hot-reloading fix)
const Signature =
  mongoose.models.Signature || mongoose.model("Signature", SignatureSchema);

export default Signature;
