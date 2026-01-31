const express = require("express");
const studentRoute = express.Router();
const studentSchema = require("../model/schema");
const messageSchema = require("../model/schema2");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Document = require("../model/Document");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const FormData = require("form-data");
const authController = require("./authController");
const appointmentController = require("./appointmentController");

// Python AI Engine URL
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:5000";

// Multer Setup with UUIDs to prevent race conditions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure uploads directory exists
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // secure filename with UUID
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// --- Auth Routes ---
studentRoute.post("/register", authController.register);
studentRoute.post("/login", authController.login);

// --- Appointment Routes ---
studentRoute.post("/appointments/book", appointmentController.bookAppointment);
studentRoute.get("/appointments", appointmentController.getAppointments);
studentRoute.put("/appointments/:id", appointmentController.updateStatus);
studentRoute.post("/ai/summarize-appointment/:id", appointmentController.summarizeSymptoms);

// --- AI Gateway Routes ---

// Proxy for General Query
studentRoute.post("/ai/query", async (req, res) => {
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/query`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("AI Query Error:", error.message);
        res.status(500).json({ error: "Failed to communicate with AI Engine" });
    }
});

// Proxy for Patient Query
studentRoute.post("/ai/patient_query", async (req, res) => {
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/patient_querry`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("AI Patient Query Error:", error.message);
        res.status(500).json({ error: "Failed to communicate with AI Engine" });
    }
});

// File Upload & Processing (Fixes Race Condition)
studentRoute.post("/ai/upload-pdf", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        // Pass the absolute file path to Python instead of relying on a shared overwrite
        const absolutePath = req.file.path;
        const userInput = req.body.user_input || "";

        // Call Python endpoint with file path
        const response = await axios.post(`${AI_ENGINE_URL}/process-pdf`, {
            file_path: absolutePath,
            user_input: userInput
        });

        // Merge Python response with file_path so frontend can store it for context
        res.json({ ...response.data, file_path: absolutePath });
    } catch (err) {
        console.error("Upload/Process Error:", err.message);
        res.status(500).send("Server Error processing PDF");
    }
});

// Voice Message Proxy
studentRoute.post("/ai/voice-message", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No audio file uploaded");
        }

        // We need to send the file to Python. Since it's audio, we can stream it or pass path.
        // Passing path is efficient for local monorepo.
        const absolutePath = req.file.path;

        // Assuming Python side expects 'audio_path' or we can re-upload using FormData if needed.
        // Let's stick to the pattern: Pass Path.
        // NOTE: Need to update Python to handle this.

        // For now, let's try re-uploading via FormData to preserve Python's existing request.files logic if possible, 
        // OR update python to take path. Updating Python is cleaner.
        // But verify: Python uses `request.files['audio']`.
        // I will actually send the file itself to be safe if `requests` supports it easily, 
        // BUT passing path is much faster. I will define a new endpoint in Python `/process-voice-path`.

        const response = await axios.post(`${AI_ENGINE_URL}/process-voice`, {
            audio_path: absolutePath
        });

        res.json(response.data);

    } catch (error) {
        console.error("Voice Error:", error.message);
        res.status(500).json({ error: "Voice processing failed" });
    }
});


// --- Existing Routes (Legacy Support / Database) ---

studentRoute.post("/upload", upload.single("document"), async (req, res) => {
    try {
        const { filename: document } = req.file;
        const newDocument = new Document({ document });
        await newDocument.save();
        res.status(201).send("Document uploaded successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


studentRoute.post("/create-doctors", (req, res) => {
    studentSchema.create(req.body, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
});


studentRoute.get("/", (req, res) => {
    studentSchema.find((err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
});

studentRoute.route("/message/:id")
    .get((req, res) => {
        studentSchema.findById(mongoose.Types.ObjectId(req.params.id), (err, data) => {
            if (err)
                return err;
            else
                res.json(data);
        })
    })

studentRoute.post("/message/write", (req, res) => {
    messageSchema.create(req.body, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
});

studentRoute.get("/messages/fetch", (req, res) => {
    messageSchema.find((err, data) => {
        if (err)
            return res.status(500).json({ error: "Internal server error" });
        else
            res.json(data);
    })
});

module.exports = studentRoute;
