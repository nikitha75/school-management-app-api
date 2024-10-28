const express = require("express");
const router = express.Router();
const {
  createStudent,
  updateStudent,
  getStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { isAuthenticated } = require("../controllers/authController");

router.post("/student/:userId", isAuthenticated, createStudent);
router.get("/student/:studentId/:userId", isAuthenticated, getStudent);
router.put("/student/:studentId/:userId", isAuthenticated, updateStudent);
router.delete("/student/:studentId/:userId", isAuthenticated, deleteStudent);

module.exports = router;
