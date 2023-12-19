const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../../model/User");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, email, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "secretKey", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Clear the token by setting it to an invalid value
    res.clearCookie("token").json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout" });
  }
});

module.exports = router;
