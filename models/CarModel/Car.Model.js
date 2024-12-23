// models/Form.js
import mongoose from "mongoose";

// Define the schema
const CarModelSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // Removes whitespace from the beginning and end
  },
  makemodel: {
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
  adminCompanyId: { type: String },
});

// Create the model
export default mongoose.models.CarModel ||
  mongoose.model("CarModel", CarModelSchema);
