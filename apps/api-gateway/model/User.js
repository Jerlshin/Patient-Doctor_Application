const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    bloodGroup: { type: String, required: true },
    medicalHistory: { type: String }, // storing as text or JSON string for now
    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);
