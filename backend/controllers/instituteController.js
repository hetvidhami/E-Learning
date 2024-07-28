import instituteUser from "../models/instituteSchema.js";
import Course from "../models/courseSchema.js";

const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  const user = await instituteUser.findOne({ email });

  if (user && (await user.matchPasswords(password)) && user.role.toLowerCase() === role.toLowerCase()) {
    res.status(200).json({
      message: "Login Successful for Institute",
      user: {
        email: user.email,
        role: user.role,
        _id: user._id,
      },
    });
  } else {
    res.status(401).json({ message: "No user found" });
  }
};

const registerUser = async (req, res) => {
    try {
      const { role, email, password } = req.body;
      const userExists = await instituteUser.findOne({ email, role });
  
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const user = await instituteUser.create({
        role: role.toLowerCase(),
        email: email,
        password: password,
      });
  
      if (user) {
        res.status(201).json({
          message: "User created successfully for Institute",
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "User already exists" });
      }
      res.status(500).json({ message: error.message });
    }
  };


const getCoursesForRole = async (req, res) => {
  const { role } = req.params;
  if (role.toLowerCase() !== "teacher") {
    res.status(400).json({ message: "Invalid role to view the courses" });
    return;
  }
  const courses = await Course.find({});

  res.status(200).json({
    message: "Courses fetched successfully",
    courses,
  });
};

const addCourses = async (req, res) => {
  const { role } = req.params;
  if (role.toLowerCase() !== "teacher") {
    res.status(400).json({ message: "Invalid role to view the courses" });
    return;
  }
  const { title, description, category, difficulty, popularity, thumbnail } = req.body;
  try {
    const course = await Course.create({
      title,
      description,
      category,
      difficulty,
      popularity,
      thumbnail,
    });
    await course.save();
    if (course) {
      res.status(201).json({
        message: "Course created successfully",
        course,
      });
    } else {
      res.status(400).json({
        message: "Invalid Course data",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteCourses = async (req, res) => {
  const { role, id } = req.params;
  if (role.toLowerCase() !== "teacher") {
    res.status(400).json({ message: "Invalid role to view the courses" });
    return;
  }
  try {
    const doc = await Course.deleteOne({ _id: id });
    res.status(200).json({
      message: "Course deleted successfully",
      doc,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getListOfAllTeachers = async (req, res) => {
  try {
    const teachers = await instituteUser.find({ role: "teacher" });
    res.status(200).json({
      message: "List of all teachers",
      teachers,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getListOfAllStudents = async (req, res) => {
  try {
    const students = await instituteUser.find({ role: "student" });
    res.status(200).json({
      message: "List of all students",
      students,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export {
  loginUser,
  registerUser,
  getCoursesForRole,
  addCourses,
  deleteCourses,
  getListOfAllTeachers,
  getListOfAllStudents,
};
