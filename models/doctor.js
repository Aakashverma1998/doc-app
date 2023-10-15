const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    userId: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    specialization: { type: String },
    fees: { type: Number },
    status: { type: String, default: "pending" },
    timings: { type: Array },
    experience: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
