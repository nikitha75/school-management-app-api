const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "prefer_not_to_say"],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  contactDetails: {
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  feesPaid: {
    type: Boolean,
    default: false,
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  role: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Student", studentSchema);
