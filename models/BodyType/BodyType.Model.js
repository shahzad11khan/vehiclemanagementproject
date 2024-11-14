// models/Form.js
import mongoose from "mongoose";

// Define the schema
const BodyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // Removes whitespace from the beginning and end
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: false, // Defaults to false if not specified
  },
  adminCreatedBy: { type: String },
  adminCompanyName: { type: String },
  adminCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

// Create the model
export default mongoose.models.BodyType ||
  mongoose.model("BodyType", BodyTypeSchema);
