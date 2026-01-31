const Appointment = require('../model/Appointment');
const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:5000";

exports.bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, symptoms } = req.body; // Assuming patientId comes from body or auth middleware

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            date,
            time,
            symptoms,
            status: 'Pending'
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Failed to book appointment" });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const { userId, role } = req.query; // Or from req.user if using middleware

        let query = {};
        if (role === 'doctor') {
            query.doctorId = userId;
        } else {
            query.patientId = userId;
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name age gender')
            .populate('doctorId', 'name specialization address');

        res.json(appointments);
    } catch (error) {
        console.error("Fetch Appointments Error:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
};

exports.summarizeSymptoms = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id).populate('patientId');
        if (!appointment) return res.status(404).json({ error: "Appointment not found" });

        // Call AI Engine
        // Assuming AI Engine has /summarize endpoint that takes text
        // We construct a text from symptoms and history
        const textToSummarize = `
      Patient: ${appointment.patientId.name}, Age: ${appointment.patientId.age}.
      Symptoms: ${appointment.symptoms}.
      Medical History: ${appointment.patientId.medicalHistory || "None"}.
    `;

        const response = await axios.post(`${AI_ENGINE_URL}/summarize`, {
            text: textToSummarize,
            min_length: 30,
            max_length: 100
        });

        const summary = response.data.summary || response.data[0]?.summary_text || "No summary generated";

        // Save summary to appointment
        appointment.aiSummary = summary;
        await appointment.save();

        res.json({ summary });

    } catch (error) {
        console.error("AI Summary Error:", error);
        res.status(500).json({ error: "AI Service Failed" });
    }
};
