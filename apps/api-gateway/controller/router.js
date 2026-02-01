const express = require("express");
const studentRoute = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Controllers
const authController = require("./authController");
const appointmentController = require("./appointmentController");
const documentController = require("./documentController");

// Models (Legacy support)
const studentSchema = require("../model/schema"); // Legacy doctors?
const messageSchema = require("../model/schema2");
const Document = require("../model/Document");

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure uploads directory exists
        const uploadDir = path.join(__dirname, "../../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Secure filename with UUID
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });


// --- Authentication Routes ---

// Register: Handles file upload for profile image
studentRoute.post("/register", upload.single("profileImage"), authController.register);

// Login
studentRoute.post("/login", authController.login);


// --- Doctor/User Data Routes ---

// Get all doctors (Legacy + New support)
studentRoute.get("/", async (req, res) => {
    try {
        // Assuming we want to return doctors from the new Doctor model
        // If you still use 'studentSchema' (legacy), switch this line.
        const Doctor = require("../model/Doctor");
        const doctors = await Doctor.find({});
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get specific doctor/user by ID
studentRoute.get("/message/:id", async (req, res) => {
    try {
        const Doctor = require("../model/Doctor");
        const User = require("../model/User");

        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        // Try finding in Doctor first, then User
        let data = await Doctor.findById(id);
        if (!data) {
            data = await User.findById(id);
        }

        if (data) res.json(data);
        else res.status(404).json({ error: "User/Doctor not found" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- Document Routes ---
studentRoute.post("/upload-document", upload.single("document"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded.");

        const { originalname, filename, path: filePath, mimetype, size } = req.file;
        const { userId } = req.body; // Ensure frontend sends userId

        const newDocument = new Document({
            userId: userId ? new mongoose.Types.ObjectId(userId) : null, // Optional for now if legacy
            filename,
            originalName: originalname,
            path: filePath,
            mimetype,
            size
        });

        await newDocument.save();
        res.status(201).json({ msg: "Document uploaded successfully", document: newDocument });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


// --- Message/Chat Routes (Legacy Support) ---
studentRoute.post("/message/write", (req, res) => {
    messageSchema.create(req.body, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

module.exports = studentRoute;