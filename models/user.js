const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    isDoctor: { type: Boolean, default: false },
    notification: { type: Array, default: [] },
    seennotification: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
