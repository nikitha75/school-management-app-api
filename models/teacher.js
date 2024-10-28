const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
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
  salary: {
    type: Number,
    default: 0,
    required: true,
  },
  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    // required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // assignedClasses: [
  //   {
  //     classId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Class",
  //       required: true,
  //     },
  //     subject: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
});

module.exports = mongoose.model("Teacher", teacherSchema);
