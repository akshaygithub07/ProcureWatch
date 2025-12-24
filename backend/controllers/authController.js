const bcrypt = require('bcrypt');
const User = require('../models/User');
const { registerUser, enrollUser } = require('../fabric/FabricUtil');
const { getWallet } = require('../fabric/CAUtil');





exports.register = async (req, res) => {
    try {
        const { org, username, affiliation, role, password } = req.body;

        // Check if user exists
        const existing = await User.findOne({ username });
        if (existing) {
            return res.json({ success: false, message: "Username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user in MongoDB
        const newUser = await User.create({
            username,
            org,
            role,
            affiliation,
            password: hashedPassword
        });

        // Register user in Fabric CA (creates secret)
        const secret = await registerUser(org, username, affiliation, role);
        console.log(`Hello ${secret}`);

        // Enroll user (creates certificate in wallet)
        await enrollUser(org, username, secret);

        // newUser.secret = secret;
        // await newUser.save();

        res.json({
            success: true,
            message: "User registered & enrolled successfully",
            user: {
                username,
                org,
                role
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { org, username, password } = req.body;

        // 1. Validate from MongoDB
        const user = await User.findOne({ username, org });
        if (!user) return res.json({ success: false, message: "User does not exist" });

        // 2. Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ success: false, message: "Incorrect password" });

        // 3. Check Fabric Wallet Identity
        const wallet = await getWallet(org);
        const identity = await wallet.get(username);
        if (!identity) {
            return res.json({ success: false, message: "Fabric identity missing" });
        }

        // 4. Success
        res.json({
            success: true,
            message: "Login successful",
            role: user.role,
            username: user.username,
            org: user.org
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
