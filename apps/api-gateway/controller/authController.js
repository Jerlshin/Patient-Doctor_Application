const User = require("../model/User");
const Doctor = require("../model/Doctor");
const path = require('path');

module.exports.register = async (req, res, next) => {
    try {
        const { email, role, ...otherData } = req.body;
        console.log("Registering user:", email, role);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Handle profile image upload
        let profileImage = "";
        if (req.file) {
            profileImage = req.file.path; // Store the full path or relative path
        }

        if (role === 'doctor') {
            // Create Doctor logic (if separate collection needed, else just User with role)
            // For now assuming unified User model with role field or separate Doctor model
            // Keeping consistent with previous logic, assuming Single User model with 'role'
            // If separate doctor logic exists, handle it.
            // Based on previous code, likely just User.
        }

        const newUser = new User({
            email,
            role,
            profileImage,
            ...otherData
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: { ...newUser.toObject(), profileImage: profileImage }
        });

    } catch (ex) {
        console.error("Register Error:", ex);
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.json({ msg: "Incorrect Username or Password", status: false });

        // Simple password check (should be hashed in production!)
        if (user.password !== password) {
            return res.json({ msg: "Incorrect Username or Password", status: false });
        }

        // Return user info including profileImage
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};
