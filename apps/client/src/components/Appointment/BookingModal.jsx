import React, { useState } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, FileText } from 'lucide-react';
import { API_BASE_URL } from "../../config/constant";
import { Modal, Button, Input } from '../../components/ui';

export default function BookingModal({ doctor, patient, onClose, onSuccess }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/doctors/appointments/book`, {
                patientId: patient.id,
                doctorId: doctor._id,
                date,
                time,
                symptoms
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Book Appointment"
            size="md"
        >
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start justify-between">
                <div>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Doctor</p>
                    <h4 className="font-bold text-blue-900 text-lg">{doctor.name}</h4>
                    <p className="text-sm text-blue-700">{doctor.specialization}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                    {doctor.name?.[0]}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        leftIcon={<Calendar size={18} />}
                    />
                    <Input
                        label="Time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        leftIcon={<Clock size={18} />}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block ml-1">Symptoms / Notes</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                        <textarea
                            required
                            rows="3"
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all"
                            placeholder="Describe how you are feeling..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        size="lg"
                    >
                        Confirm Booking
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
