const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', async (req, res) => {
  console.log(req.body);

  try {
    const {
      userID,
      role,
      buyerType,
      companyName,
      institute,
      firstName,
      lastName,
      email,
      password
    } = req.body;

    if (!userID || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await User.findOne({
      $or: [{ userID }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userID,
      role,
      buyerType,
      companyName,
      institute,
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    
    const token = jwt.sign(
      { userID: newUser.userID, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      userID: newUser.userID,
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { userID, password } = req.body;

    if (!userID || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ userID });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userID: user.userID, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      userID: user.userID,
      role: user.role,
      firstName: user.firstName,
      lastName:user.lastName
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
