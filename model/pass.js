import mongoose from "mongoose";
const passSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  expiryDate: {
    type: Date,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isScanned: {
    type: Boolean,
    default: false,
  },
});
export default mongoose.model("Pass", passSchema);
