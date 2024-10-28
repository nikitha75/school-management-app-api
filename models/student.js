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
    // address: {
    //   street: { type: String },
    //   city: { type: String },
    //   state: { type: String },
    //   zip: { type: String },
    // },
  },
  feesPaid: {
    type: Boolean,
    default: false,
    required: true,
  },
  // feesPaid: {
  //   type: Number,
  //   default: 0,
  //   required: true,
  // },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    // required: true,
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
