import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, MapPin, Search, PlusCircle, LogOut, FileText, History, Stethoscope, Briefcase, Filter, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from "../../config/constant";
import BookingModal from '../Appointment/BookingModal';
import { Button, Input, Card } from '../../components/ui';

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

    const tabs = [
        { id: 'find', label: 'Find Doctor', icon: <Search size={18} /> },
        { id: 'upcoming', label: 'Upcoming', icon: <Calendar size={18} />, count: upcomingAppointments.length },
        { id: 'history', label: 'History', icon: <History size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                            {user.name?.[0]}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Hello, {user.name}</h1>
                            <p className="text-xs text-gray-500">Patient Dashboard</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={handleLogout}
                        leftIcon={<LogOut size={18} />}
                    >
                        Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-8 w-full md:w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'find' && (
                    <div className="space-y-6 animate-slide-up">
                        {/* Search Bar */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Input
                                    placeholder="Search by name, specialization, or bio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    leftIcon={<Search size={20} />}
                                    className="border-gray-200 bg-gray-50 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                                        value={filterExp}
                                        onChange={(e) => setFilterExp(e.target.value)}
                                    >
                                        <option value="">All Experience Levels</option>
                                        <option value="5">5+ Years</option>
                                        <option value="10">10+ Years</option>
                                        <option value="15">15+ Years</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDoctors.map(doc => (
                                <Card key={doc._id} hoverable className="h-full flex flex-col">
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                                    {doc.name[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{doc.name}</h3>
                                                    <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-100">
                                                        {doc.specialization}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <p className="text-gray-600 text-sm line-clamp-2">{doc.bio || "Experienced specialist dedicated to patient care."}</p>

                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase size={14} className="text-blue-500" />
                                                    <span>{doc.experience || 1}+ Yrs Exp</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-red-500" />
                                                    <span className="truncate">{doc.address || "Main Clinic"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-2">
                                            <Button
                                                className="w-full"
                                                onClick={() => setSelectedDoctor(doc)}
                                                leftIcon={<PlusCircle size={18} />}
                                            >
                                                Book Appointment
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {filteredDoctors.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <Search size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p>No doctors found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'upcoming' && (
                    <div className="space-y-4 animate-slide-up">
                        {upcomingAppointments.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No Upcoming Appointments</h3>
                                <p className="text-gray-500 mt-1">Book an appointment to see it here.</p>
                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={() => setActiveTab('find')}
                                >
                                    Find a Doctor
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcomingAppointments.map(apt => (
                                    <Card key={apt._id} className="border-l-4 border-l-blue-500">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{apt.doctorId?.name || "Doctor"}</h3>
                                                        <p className="text-xs text-gray-500">{apt.doctorId?.specialization || "Specialist"}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={16} className="text-blue-500" />
                                                    <span className="font-medium">{new Date(apt.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="border-l border-gray-300 h-4" />
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={16} className="text-orange-500" />
                                                    <span className="font-medium">{apt.time}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Symptoms Identified</p>
                                                <p className="text-sm text-gray-800 line-clamp-1">{apt.symptoms}</p>
                                            </div>
                                        </div>

                                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                                View Details
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4 animate-slide-up">
                        {historyAppointments.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <History className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500">No appointment history found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {historyAppointments.map(apt => (
                                    <div key={apt._id} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">
                                                <History size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{apt.doctorId?.name}</h3>
                                                <div className="text-gray-500 text-sm flex items-center gap-2 mt-0.5">
                                                    <span>{new Date(apt.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{apt.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Booking Modal */}
            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    patient={user}
                    onClose={() => setSelectedDoctor(null)}
                    onSuccess={() => {
                        fetchAppointments();
                        setSelectedDoctor(null);
                        setActiveTab('upcoming');
                    }}
                />
            )}
        </div>
    );
}
