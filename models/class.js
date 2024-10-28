const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  studentFees: {
    type: Number,
    default: 0,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

module.exports = mongoose.model("Class", classSchema);
