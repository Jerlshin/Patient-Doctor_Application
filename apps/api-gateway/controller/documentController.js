const Document = require('../model/Document');
const User = require('../model/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename: userId-timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (Optional: restrict types)
const fileFilter = (req, file, cb) => {
    // Accept images, pdfs, docs
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images, PDFs, and Word documents are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

exports.upload = upload;

// Controller Functions
exports.uploadDocuments = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }

        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const savedDocuments = [];

        for (const file of files) {
            const newDoc = new Document({
                userId: userId,
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            });
            const savedDoc = await newDoc.save();
            savedDocuments.push(savedDoc);
        }

        res.status(201).json({
            message: "Documents uploaded successfully",
            documents: savedDocuments
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload documents" });
    }
};

exports.getUserDocuments = async (req, res) => {
    try {
        const { userId } = req.params;
        const documents = await Document.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        console.error("Fetch documents error:", error);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
};

exports.uploadMiddleware = upload.array('documents', 5); // Allow up to 5 files
exports.profileImageMiddleware = upload.single('profileImage');
