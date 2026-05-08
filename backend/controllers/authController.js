const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/ticketbooking");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is missing in backend/.env"
    });
  }

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required."
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email is already registered."
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: "Signup successful.",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is missing in backend/.env"
    });
  }

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required."
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

module.exports = {
  signup,
  login
};
