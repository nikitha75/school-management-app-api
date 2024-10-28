const Student = require("../models/student");
const Class = require("../models/class");

const studentRole = parseInt(process.env.STUDENT_ROLE);

exports.createStudent = async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    gender,
    dob,
    phone,
    address,
    feesPaid = false,
    classId,
    role = 0,
  } = req.body;
  if (!name || !gender || !dob || !phone || !address || !feesPaid) {
    return res.status(400).json("All fields are required!");
  }
  try {
    if (req.userId === userId) {
      const classDetails = await Class.findById(classId);
      const student = await Student.create({
        name,
        gender,
        dob: new Date(dob),
        contactDetails: {
          phone,
          address,
        },
        feesPaid,
        assignedClass: classDetails ? classDetails._id : null,
        userId,
        role,
      });
      res.status(200).json({
        success: true,
        message: "Profile setup successful!",
        student,
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

exports.getStudent = async (req, res) => {
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
      return res.status(200).json({
        success: true,
        message: "Fetched profile!",
        student,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Unauthorized to fetch student",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.updateStudent = async (req, res) => {
  const { studentId, userId } = req.params;
  const { name, gender, dob, phone, address, feesPaid, classId } = req.body;
  try {
    if (req.role === studentRole && req.userId === userId) {
      const isStudentExist = await Student.findById(studentId);
      if (!isStudentExist) {
        return res.status(400).json({
          error: "Student doesn't exist.",
        });
      }
      const updatedData = {};
      if (name) {
        updatedData.name = name;
      }
      if (gender) {
        updatedData.gender = gender;
      }
      if (dob) {
        updatedData.dob = new Date(dob);
      }
      if (phone) {
        updatedData.contactDetails = {
          ...isStudentExist.contactDetails,
          phone,
        };
      }
      if (address) {
        updatedData.contactDetails = updatedData.contactDetails
          ? { ...updatedData.contactDetails, address }
          : {
              ...isStudentExist.contactDetails,
              address,
            };
      }
      if (feesPaid) {
        updatedData.feesPaid = feesPaid;
      }
      if (classId) {
        const isClassExist = await Class.findById(classId);
        if (!isClassExist) {
          return res.status(400).json({
            error: "Class doesn't exist.",
          });
        }
        updatedData.class = classId;
        await Class.findByIdAndUpdate(
          classId,
          { students: [...isClassExist.students, studentId] },
          { new: true }
        );
      }
      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        updatedData,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Updated details!",
        updatedStudent,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Unauthorized to update student",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.deleteStudent = async (req, res) => {
  const { studentId, userId } = req.params;
  try {
    if (req.role === studentRole && req.userId === userId) {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(400).json({
          success: false,
          message: "Student doesn't exist.",
        });
      }
      const deletedStudent = await Student.findByIdAndDelete(studentId);
      res.status(200).json({
        success: true,
        message: "Student deleted!",
        deletedStudent,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Unauthorized to delete student",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
