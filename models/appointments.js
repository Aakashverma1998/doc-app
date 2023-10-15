const mongoose = require("mongoose");

const appointmentsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    doctorInfo: {
      type: String,
    },
    userInfo: {
      type: String,
    },
    date: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    time: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appointments", appointmentsSchema);
