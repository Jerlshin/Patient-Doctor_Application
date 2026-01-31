const User = require('../model/User');
const Doctor = require('../model/Doctor');
// const bcrypt = require('bcryptjs'); // User cancelled install, commenting out for now or assuming it will be there.
// const jwt = require('jsonwebtoken');

// Mocking bcrypt/jwt if not available for hackathon speed? 
// No, user requirement says "Password (hashed)".
// I will require them and assume user will install or I will try installing again later if it fails.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "hackathon_secret_key";

exports.register = async (req, res) => {
    try {
        const { role, email, password, ...otherData } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user/doctor exists
        const Model = role === 'doctor' ? Doctor : User;
        const existing = await Model.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create record
        const newRecord = new Model({
            ...otherData,
            email,
            password: hashedPassword
        });

        await newRecord.save();

        // Generate Token
        const token = jwt.sign({ id: newRecord._id, role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: newRecord._id,
                name: newRecord.name,
                role
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

exports.login = async (req, res) => {
    try {
        const { role, email, password } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const Model = role === 'doctor' ? Doctor : User;
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                role,
                // Send extra data for dashboard
                ...(role === 'doctor' ? { specialization: user.specialization } : { age: user.age })
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};
