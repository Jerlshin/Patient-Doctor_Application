const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'patient' },
    
    // Patient Specific Details
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    
    // Medical Info
    medicalHistory: { type: String }, // Stored as text or JSON string
    allergies: { type: String },
    currentMedications: { type: String },
    emergencyContact: { type: String },

    bio: { type: String },
    profileImage: { type: String }, // Filename of uploaded image
    
    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);