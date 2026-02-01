const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    medicalHistory: { type: String }, // storing as text or JSON string for now
    bio: { type: String },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);
