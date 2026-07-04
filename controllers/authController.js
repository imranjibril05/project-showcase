const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);





const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


exports.register = async (req, res) => {
  try {
  
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      profilePic: req.file ? req.file.path : undefined
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });


  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.googleLogin = async (req, res) => {
  try {

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Missing Google credential"
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const {
      email,
      name,
      picture
    } = payload;

    let user = await User.findOne({ email });

    // New Google user
    if (!user) {

      // Generate secure random password
      const randomPassword = crypto.randomBytes(32).toString("hex");

      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({

        name,

        email,

        password: hashedPassword,

        profilePic: picture

      });

    }

    const token = generateToken(user);

    return res.json({

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        profilePic: user.profilePic

      }

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      message: "Google authentication failed"

    });

  }
};