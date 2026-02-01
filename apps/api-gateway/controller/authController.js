const User = require("../model/User");
const Doctor = require("../model/Doctor");

module.exports.register = async (req, res, next) => {
    try {
        // Log the body to debug what frontend sends
        console.log("Register Request Body:", req.body);
        
        const { email, role, password, name, type, ...otherData } = req.body;
        
        // Normalize role (frontend might send 'type' or 'role')
        const userRole = (role || type || 'patient').toLowerCase();

        // Handle Profile Image
        let profileImage = "";
        if (req.file) {
            profileImage = req.file.filename; 
        }

        if (userRole === 'doctor') {
            // Check if doctor exists
            const existingDoctor = await Doctor.findOne({ email });
            if (existingDoctor) {
                return res.json({ msg: "Doctor with this email already exists", status: false });
            }

            // Create new Doctor
            const newDoctor = new Doctor({
                name,
                email,
                password, // NOTE: In production, hash this password (e.g., bcrypt)
                role: 'doctor',
                image: profileImage,
                specialization: otherData.specialization || 'General Physician', // Fallback
                ...otherData
            });

            await newDoctor.save();
            return res.status(201).json({ status: true, msg: "Doctor registered successfully", user: newDoctor });

        } else {
            // Default to Patient
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.json({ msg: "Patient with this email already exists", status: false });
            }

            // Create new Patient
            const newUser = new User({
                name,
                email,
                password, // NOTE: In production, hash this password
                role: 'patient',
                profileImage: profileImage,
                ...otherData
            });

            await newUser.save();
            return res.status(201).json({ status: true, msg: "Patient registered successfully", user: newUser });
        }

    } catch (ex) {
        console.error("Register Error:", ex);
        res.status(500).json({ msg: ex.message || "Registration failed due to server error", status: false });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password, role, type } = req.body;
        
        // Normalize role
        const userRole = (role || type || 'patient').toLowerCase();
        
        let user = null;

        if (userRole === 'doctor') {
            user = await Doctor.findOne({ email });
        } else {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.json({ msg: "Incorrect Email or Role selected", status: false });
        }
        
        // Simple password check
        // NOTE: If you add hashing in Register, use bcrypt.compare here
        if (user.password !== password) {
            return res.json({ msg: "Incorrect Password", status: false });
        }

        // Return user data (excluding password ideally, but keeping it simple for now)
        const userObj = user.toObject();
        delete userObj.password;

        return res.json({ status: true, user: userObj });
    } catch (ex) {
        console.error("Login Error:", ex);
        next(ex);
    }
};