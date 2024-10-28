const Teacher = require("../models/teacher");
const Class = require("../models/class");

// exports.createTeacher = async (req, res) => {
//   const { name, gender, dob, contactDetails, salary, classId } = req.body;
//   const { phone, address } = contactDetails;

//   //   if (!name || !gender || !dob || !phone || !address || !salary || !classId) {
//   //     return res.status(400).json("All fields are required!");
//   //   }

//   if (!name || !gender || !dob || !phone || !address || !salary) {
//     return res.status(400).json("All fields are required!");
//   }

//   try {
//     const classDetails = await Class.findById(classId);

//     const teacher = await Teacher.create({
//       name,
//       gender,
//       dob: new Date(dob),
//       contactDetails: {
//         phone,
//         address,
//       },
//       salary,
//       assignedClass: classDetails ? classDetails._id : null,
//     });

//     // contactDetails: {
//     //     phone,
//     //     address: {
//     //         street: address.street,
//     //         city: address.city,
//     //         state: address.state,
//     //         zip: address.zip
//     //       }
//     //   },

//     res.status(200).json({
//       success: true,
//       message: "Teacher created!",
//       teacher,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// };

const teacherRole = parseInt(process.env.TEACHER_ROLE);

exports.createTeacher = async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    gender,
    dob,
    phone,
    address,
    salary,
    classId,
    role = 1,
    // isTeacher = true,
  } = req.body;

  // const { formData } = req.body;
  // console.log("formData: ", formData);
  // const { name, gender, dob, phone, address, salary } = formData;

  // const { name, gender, dob, phone, address, salary, classId } = teacherData;

  // const { name, gender, dob, contactDetails, salary, classId } = teacherData;
  // const { phone, address } = contactDetails;

  //   if (!name || !gender || !dob || !phone || !address || !salary || !classId) {
  //     return res.status(400).json("All fields are required!");
  //   }

  if (!name || !gender || !dob || !phone || !address || !salary) {
    return res.status(400).json("All fields are required!");
  }

  // const role = isTeacher ? 1 : 0;

  try {
    if (req.userId === userId) {
      const classDetails = await Class.findById(classId);

      const teacher = await Teacher.create({
        name,
        gender,
        dob: new Date(dob),
        contactDetails: {
          phone,
          address,
        },
        salary,
        assignedClass: classDetails ? classDetails._id : null,
        userId,
        role,
      });

      // contactDetails: {
      //     phone,
      //     address: {
      //         street: address.street,
      //         city: address.city,
      //         state: address.state,
      //         zip: address.zip
      //       }
      //   },

      res.status(200).json({
        success: true,
        message: "Profile setup successful!",
        teacher,
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
  const { teacherId, userId } = req.params;

  try {
    // const teacher = await Teacher.find({ _id: teacherId });
    if (req.role === teacherRole && req.userId === userId) {
      const teacher = await Teacher.findById(teacherId);

      if (!teacher) {
        return res.status(400).json({
          success: false,
          message: "Teacher doesn't exist.",
        });
      }

      const classDetails = await Class.findById(teacher.assignedClass);

      return res.status(200).json({
        success: true,
        message: "Fetched profile!",
        teacher,
        classDetails,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to fetch user!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.updateTeacher = async (req, res) => {
  const { teacherId, userId } = req.params;
  const { name, gender, dob, phone, address, salary, classId } = req.body;

  // const { name, gender, dob, contactDetails, salary, classId } = req.body;

  // if (contactDetails) {
  //   const { phone, address } = contactDetails;
  // }

  try {
    if (req.role === teacherRole && req.userId === userId) {
      // if (req.teacherId === teacherId) {}
      // else{
      //   res.status(401).json({
      //     success: false,
      //     error: "Unauthorized to update teacher",
      //   });
      // }

      const isTeacherExist = await Teacher.findById(teacherId);
      if (!isTeacherExist) {
        return res.status(400).json({
          error: "Teacher doesn't exist.",
        });
      }

      // const updatedData = {
      //   ...(name && { name }),
      //   ...(gender && { gender }),
      //   ...(dob && { dob }),
      //   ...(phone && { phone }),
      //   ...(address && { address }),
      //   ...(salary && { salary }),
      //   ...(classId && { classId }),
      // };

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
          ...isTeacherExist.contactDetails,
          phone,
        };
      }

      if (address) {
        updatedData.contactDetails = updatedData.contactDetails
          ? { ...updatedData.contactDetails, address }
          : {
              ...isTeacherExist.contactDetails,
              address,
            };
      }

      if (salary) {
        updatedData.salary = salary;
      }

      if (classId) {
        const isClassExist = await Class.findById(classId);
        if (!isClassExist) {
          return res.status(400).json({
            error: "Class doesn't exist.",
          });
        }
        await Teacher.findOneAndUpdate(
          { assignedClass: classId },
          { assignedClass: null },
          { new: true }
        );
        await Class.findByIdAndUpdate(
          classId,
          { teacher: teacherId },
          { new: true }
        );
        updatedData.assignedClass = classId;
      }

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        updatedData,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Updated details!",
        updatedTeacher,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to update user!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  const { teacherId, userId } = req.params;
  try {
    if (req.role === teacherRole && req.userId === userId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(400).json({
          success: false,
          message: "Teacher doesn't exist.",
        });
      }
      const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
      res.status(200).json({
        success: true,
        message: "Teacher deleted!",
        deletedTeacher,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unautorized to delete user!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
