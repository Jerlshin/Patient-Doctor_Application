import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, MapPin, Search, PlusCircle, LogOut, FileText, History, Stethoscope, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from "../../config/constant";
import BookingModal from '../Appointment/BookingModal';

export default function PatientDashboard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterExp, setFilterExp] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState('find'); // 'find', 'upcoming', 'history'
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/doctors/appointments`, {
                params: { userId: user.id, role: 'user' }
            });
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/doctors/`);
            setDoctors(res.data);
        } catch (err) {
            console.error("Failed to fetch doctors", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        toast.success("Logged out successfully");
    };

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = (doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.bio?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesExp = filterExp ? (doc.experience >= parseInt(filterExp)) : true;

        return matchesSearch && matchesExp;
    });

    const upcomingAppointments = appointments.filter(apt => ['Pending', 'Confirmed'].includes(apt.status));
    const historyAppointments = appointments.filter(apt => ['Completed', 'Cancelled'].includes(apt.status));

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Hello, {user.name} 👋</h1>
                    <p className="text-gray-500">Manage your health and appointments</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
                    <button
                        onClick={() => setActiveTab('find')}
                        className={`pb-3 px-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'find' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Search size={18} /> Find Doctor
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-3 px-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Calendar size={18} /> Upcoming
                        {upcomingAppointments.length > 0 && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{upcomingAppointments.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 px-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <History size={18} /> History
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'find' && (
                    <div className="space-y-6">
                        {/* Search Bar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 flex-wrap">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search name, specialization, or bio..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative min-w-[150px]">
                                <Briefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    value={filterExp}
                                    onChange={(e) => setFilterExp(e.target.value)}
                                >
                                    <option value="">Any Experience</option>
                                    <option value="5">5+ Years</option>
                                    <option value="10">10+ Years</option>
                                    <option value="15">15+ Years</option>
                                </select>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDoctors.map(doc => (
                                <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                                            {doc.name[0]}
                                        </div>
                                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                            {doc.specialization}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{doc.bio || "No bio available."}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Briefcase size={14} /> {doc.experience || 0} Yrs
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} /> {doc.address || "Main Clinic"}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedDoctor(doc)}
                                        className="w-full bg-white border border-blue-600 text-blue-600 py-2 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2"
                                    >
                                        <PlusCircle size={18} /> Book Appointment
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'upcoming' && (
                    <div className="grid gap-4">
                        {upcomingAppointments.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                                <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500">No upcoming appointments found</p>
                            </div>
                        ) : (
                            upcomingAppointments.map(apt => (
                                <div key={apt._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">{apt.doctorId?.name || "Doctor"}</h3>
                                            <div className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(apt.date).toLocaleDateString()} at {apt.time}</span>
                                            </div>
                                            <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                                                <span className="font-medium">Symptoms:</span> {apt.symptoms}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="grid gap-4">
                        {historyAppointments.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                                <History className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500">No appointment history found</p>
                            </div>
                        ) : (
                            historyAppointments.map(apt => (
                                <div key={apt._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-75">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center">
                                            <History size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">{apt.doctorId?.name}</h3>
                                            <div className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(apt.date).toLocaleDateString()} at {apt.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    patient={user}
                    onClose={() => setSelectedDoctor(null)}
                    onSuccess={() => {
                        fetchAppointments();
                        setSelectedDoctor(null);
                        setActiveTab('upcoming'); // Switch to upcoming tab
                    }}
                />
            )}
        </div>
    );
}
