// import { hash, compare } from 'bcrypt';
// import { findOne, create } from '../models/User';
// import { registerUser, enrollUser } from '../fabric/FabricUtil';
// import { getWallet } from '../fabric/CAUtil';





// export async function register(req, res) {
//     try {
//         const { org, username, affiliation, role, password } = req.body;

//         // Check if user exists
//         const existing = await findOne({ username });
//         if (existing) {
//             return res.json({ success: false, message: "Username already exists" });
//         }

//         // Hash password
//         const hashedPassword = await hash(password, 10);

//         // Save user in MongoDB
//         const newUser = await create({
//             username,
//             org,
//             role,
//             affiliation,
//             password: hashedPassword
//         });

//         // Register user in Fabric CA (creates secret)
//         const secret = await registerUser(org, username, affiliation, role);
//         console.log(`Hello ${secret}`);

//         // Enroll user (creates certificate in wallet)
//         await enrollUser(org, username, secret);

//         // newUser.secret = secret;
//         // await newUser.save();

//         res.json({
//             success: true,
//             message: "User registered & enrolled successfully",
//             user: {
//                 username,
//                 org,
//                 role
//             }
//         });

//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }

// export async function login(req, res) {
//     try {
//         const { org, username, password } = req.body;

//         // 1. Validate from MongoDB
//         const user = await findOne({ username, org });
//         if (!user) return res.json({ success: false, message: "User does not exist" });

//         // 2. Compare passwords
//         const match = await compare(password, user.password);
//         if (!match) return res.json({ success: false, message: "Incorrect password" });

//         // 3. Check Fabric Wallet Identity
//         const wallet = await getWallet(org);
//         const identity = await wallet.get(username);
//         if (!identity) {
//             return res.json({ success: false, message: "Fabric identity missing" });
//         }

//         // 4. Success
//         res.json({
//             success: true,
//             message: "Login successful",
//             role: user.role,
//             username: user.username,
//             org: user.org
//         });

//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




exports.register = async (req, res) => {
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

    res.status(201).json({
      message: "User registered successfully",
      userID: newUser.userID
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { userID, password } = req.body;

    const user = await User.findOne({ userID });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      { userID: user.userID, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      userID: user.userID,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


