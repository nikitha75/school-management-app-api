const Class = require("../models/class");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

const teacherRole = parseInt(process.env.TEACHER_ROLE);
const studentRole = parseInt(process.env.STUDENT_ROLE);
const adminRole = parseInt(process.env.ADMIN_ROLE);

exports.createClass = async (req, res) => {
  const { userId } = req.params;
  const { name, year, teacher, studentFees, students } = req.body;

  //   if (!name || !year || !teacher || !studentFees || !students) {
  //     return res.status(400).json("All fields are required!");
  //   }

  if (!name || !year || !studentFees) {
    return res.status(400).json("All fields are required!");
  }

  try {
    if (req.userId === userId) {
      const newClass = await Class.create({
        name,
        year,
        studentFees,
        teacher,
        students,
      });

      res.status(200).json({
        success: true,
        message: "Class details added!",
        newClass,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to add class details!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.getClass = async (req, res) => {
  const { classId, userId } = req.params;

  try {
    if (req.userId === userId) {
      const classDetails = await Class.find({ _id: classId });
      if (!classDetails) {
        return res.status(400).json({
          success: false,
          message: "Class doesn't exist.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fetched Class!",
        classDetails,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to create profile!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.getClasses = async (req, res) => {
  const { userId } = req.params;
  try {
    if (req.userId === userId) {
      const classes = await Class.find({});
      if (!classes) {
        return res.status(400).json({
          success: false,
          message: "No class found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fetched Classes!",
        classes,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to create profile!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.updateClass = async (req, res) => {
  const { classId, userId } = req.params;
  const { name, year, teacherId, studentFees, studentId } = req.body;

  try {
    if (req.userId === userId) {
      // if (req.classId === classId) {}
      // else{
      //   res.status(401).json({
      //     success: false,
      //     error: "Unauthorized to update class",
      //   });
      // }

      const isClassExist = await Class.findById(classId);
      if (!isClassExist) {
        return res.status(400).json({
          error: "Class doesn't exist.",
        });
      }

      const updatedData = {};

      if (name) {
        updatedData.name = name;
      }

      if (year) {
        updatedData.year = year;
      }

      if (studentFees) {
        // updatedData.studentFees = updatedData.studentFees || [];
        updatedData.studentFees = studentFees;
      }

      if (teacherId) {
        await Teacher.findOneAndUpdate(
          { assignedClass: classId },
          { assignedClass: null },
          { new: true }
        );
        const isTeacherExist = await Teacher.findById(teacherId);
        if (!isTeacherExist) {
          return res.status(400).json({
            error: "Teacher doesn't exist.",
          });
        }
        await Teacher.findByIdAndUpdate(
          teacherId,
          { assignedClass: classId },
          { new: true }
        );
        updatedData.teacher = teacherId;
      }

      // if (students) {
      //   updatedData.students = students;
      // }

      // if (students) {
      //   updatedData.students = students;
      // }

      // if (students && students.length > 0) {
      // const updatedStudents = await Student.updateMany(
      //   { _id: { $in: students } },
      //   { classId },
      //   { new: true }
      // );
      // }

      if (studentId) {
        const isStudentExist = await Student.findById(studentId);
        if (!isStudentExist) {
          return res.status(400).json({
            error: "Student doesn't exist.",
          });
        }
        const updatedStudent = await Student.findByIdAndUpdate(
          studentId,
          { class: classId },
          { new: true }
        );
        updatedData.students = [
          ...new Set([...isClassExist.students, studentId]),
        ];
      }

      const updatedClass = await Class.findByIdAndUpdate(classId, updatedData, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Class updated!",
        updatedClass,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to create profile!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.getTeacher = async (req, res) => {
  const { studentId, userId } = req.params;
  try {
    if (req.role === studentRole && req.userId === userId) {
      const student = await Student.findById({ _id: studentId });
      if (!student) {
        return res.status(400).json({
          success: false,
          message: "Student doesn't exist.",
        });
      }

      const classDetails = await Class.findOne({ _id: student.class });
      if (!classDetails) {
        return res.status(400).json({
          success: false,
          message: "No class found",
        });
      }

      // const classDetails = await Class.findOne({ teacher: teacherId });
      // if (!classDetails) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "No class found",
      //   });
      // }

      const teacher = await Teacher.findById({ _id: classDetails.teacher });
      if (!teacher) {
        return res.status(400).json({
          success: false,
          message: "No teacher found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fetched teacher details!",
        teacher,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Unauthorized to fetch teacher details",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.getStudents = async (req, res) => {
  const { teacherId, userId } = req.params;

  try {
    if (
      (req.role === teacherRole || req.role === adminRole) &&
      req.userId === userId
    ) {
      let adminStudentsData = [];
      if (req.role === adminRole) {
        adminStudentsData = await Student.find({});
        if (!adminStudentsData) {
          return res.status(400).json({
            success: false,
            message: "No class found",
          });
        }
      } else {
        // return res.status(200).json({
        //   success: true,
        //   message: "Fetched Classes!",
        //   classes,
        // });

        const teacher = await Teacher.find({ _id: teacherId });
        if (!teacher) {
          return res.status(400).json({
            success: false,
            message: "Teacher doesn't exist.",
          });
        }

        const classDetails = await Class.findOne({ teacher: teacherId });
        if (!classDetails) {
          return res.status(400).json({
            success: false,
            message: "No class found",
          });
        }

        let studentsList = [];
        for (const studentId of classDetails.students) {
          const student = await Student.findOne({ _id: studentId });
          if (student) {
            studentsList.push(student);
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: "Fetched Students!",
        studentsData: adminStudentsData ? adminStudentsData : studentsList,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Unauthorized to fetch students",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.deleteClass = async (req, res) => {
  const { classId, userId } = req.params;
  try {
    if (req.userId === userId) {
      const classDetails = await Class.findById(classId);
      if (!classDetails) {
        return res.status(400).json({
          success: false,
          message: "Class doesn't exist.",
        });
      }
      const deletedClass = await Class.findByIdAndDelete(classId);
      res.status(200).json({
        success: true,
        message: "Class deleted!",
        deletedClass,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to create profile!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
