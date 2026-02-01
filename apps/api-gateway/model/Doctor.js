const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'doctor' },

    // Professional Details
    specialization: { type: String, required: true }, // e.g., Cardiologist
    licenseNumber: { type: String }, // Medical License ID
    experience: { type: Number }, // Years of experience
    degrees: { type: String }, // MBBS, MD, etc.
    
    // Clinic/Hospital Details
    address: { type: String }, 
    location: { type: String }, // City/Area for filtering
    consultationFee: { type: Number },
    availableHours: { type: String }, // e.g. "09:00 AM - 05:00 PM"
    
    // Meta
    bio: { type: String },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    image: { type: String }, // Filename of uploaded image
    profession: { type: String }, // Alias/Search tag

    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'doctors'
});

module.exports = mongoose.model('Doctor', doctorSchema);