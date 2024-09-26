// models/Form.js
import mongoose from "mongoose";

// Define the schema
const InsurenceSchema = new mongoose.Schema({
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
});

// Create the model
export default mongoose.models.Insurence ||
  mongoose.model("Insurence", InsurenceSchema);
