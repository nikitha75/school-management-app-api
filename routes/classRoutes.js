const express = require("express");
const router = express.Router();
const {
  createClass,
  updateClass,
  getClass,
  deleteClass,
  getStudents,
  getTeacher,
  getClasses,
} = require("../controllers/classController");
const { isAuthenticated, isAdmin } = require("../controllers/authController");

router.post("/class/:userId", isAuthenticated, isAdmin, createClass);
router.get("/class/:classId/:userId", isAuthenticated, isAdmin, getClass);
router.get("/classes/:userId", isAuthenticated, isAdmin, getClasses);
router.get("/class/teacher/:studentId/:userId", isAuthenticated, getTeacher);
router.get("/class/students/:teacherId/:userId", isAuthenticated, getStudents);
router.put("/class/:classId/:userId", isAuthenticated, isAdmin, updateClass);
router.delete("/class/:classId/:userId", isAuthenticated, isAdmin, deleteClass);

module.exports = router;
