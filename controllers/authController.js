const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.isAuthenticated = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    return res.status(401).send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, process.env.JWT_SECRET, (error, payload) => {
      if (error) {
        return res.status(401).send("Invalid JWT Token");
      } else {
        req.userId = payload.userId;
        req.role = payload.role;
        next();
      }
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.role !== 5) {
    return res.status(403).json({
      success: false,
      message: "Admin access denied",
    });
  }
  next();
};

generateToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
};

exports.signup = async (req, res) => {
  const { username, email, password, role = 0 } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }
  try {
    const isAccountExist = await User.findOne({ email });
    if (isAccountExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    const userDetails = await newUser.save();
    const jwtToken = generateToken({
      userId: userDetails._id,
      role: userDetails.role,
    });
    res.status(200).json({
      success: true,
      message: "Signup successful!",
      username: userDetails.username,
      email: userDetails.email,
      userId: userDetails._id,
      role: userDetails.role,
      jwtToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      sucesss: false,
      message: "Email is required!",
    });
  }
  if (!password) {
    return res.status(400).json({
      sucesss: false,
      message: "Passsword is required!",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Email/Password is incorrect",
      });
    }
    if (user && isPasswordMatch) {
      const jwtToken = generateToken({
        userId: user._id,
        role: user.role,
      });
      user.jwtToken = jwtToken;
      user.password = undefined;

      let teacher;
      let student;
      if (user.role === 1 || user.role === 5) {
        teacher = await Teacher.findOne({ userId: user._id });
        if (!teacher) {
          return res.status(400).json({
            success: false,
            message: "Teacher does not exist",
          });
        }
      } else if (user.role === 0) {
        student = await Student.findOne({ userId: user._id });
        if (!student) {
          return res.status(400).json({
            success: false,
            message: "Student does not exist",
          });
        }
      }
      res.status(200).json({
        success: true,
        message: "Login successful!",
        jwtToken,
        user,
        personDetails: user.role === 1 || user.role === 5 ? teacher : student,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
