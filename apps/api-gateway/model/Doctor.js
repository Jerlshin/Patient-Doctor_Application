const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    licenseNumber: { type: String, required: true }, // [NEW] License Number
    experience: { type: Number, required: true }, // Years of experience
    address: { type: String, required: true }, // Clinic/Hospital Address
    bio: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    image: { type: String }, // URL or path to image
    location: { type: String }, // City/Area for filtering
    profession: { type: String }, // Keeping for backward compatibility if needed, or alias to specialization
    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'doctors'
});

module.exports = mongoose.model('Doctor', doctorSchema);
