import mongoose from "mongoose";

const SignatureSchema = new mongoose.Schema(
  {
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
      type: String, // Store the path or URL of the image file
      default: "",
    },
    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
    adminCompanyId: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create a model from the schema
export default FormData =
  mongoose.models.Signature || mongoose.model("Signature", SignatureSchema);
