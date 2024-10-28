const express = require("express");
const router = express.Router();
const {
  createTeacher,
  updateTeacher,
  getTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");
const { isAuthenticated } = require("../controllers/authController");

router.post("/teacher/:userId", isAuthenticated, createTeacher);
router.get("/teacher/:teacherId/:userId", isAuthenticated, getTeacher);
router.put("/teacher/:teacherId/:userId", isAuthenticated, updateTeacher);
router.delete("/teacher/:teacherId/:userId", isAuthenticated, deleteTeacher);

module.exports = router;
