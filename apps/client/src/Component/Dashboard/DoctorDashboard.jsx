import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Sparkles, CheckCircle, XCircle, LogOut, Inbox, History, Activity } from 'lucide-react';
import { API_BASE_URL } from "../../config/constant";

import { toast } from 'react-hot-toast';

export default function DoctorDashboard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [appointments, setAppointments] = useState([]);
    const [loadingAi, setLoadingAi] = useState(null);
    const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'schedule', 'history'
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/doctors/appointments`, {
                params: { userId: user.id, role: 'doctor' }
            });
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            toast.error("Failed to load appointments");
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/doctors/appointments/${id}`, { status });
            toast.success(`Appointment ${status}`);
            fetchAppointments();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const generateSummary = async (id) => {
        setLoadingAi(id);
        const toastId = toast.loading("Analyzing symptoms...");
        try {
            const res = await axios.post(`${API_BASE_URL}/doctors/ai/summarize-appointment/${id}`);
            fetchAppointments();
            toast.success("AI Summary Generated!", { id: toastId });
        } catch (err) {
            toast.error("Failed to generate AI summary", { id: toastId });
        } finally {
            setLoadingAi(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        toast.success("Logged out successfully");
    };

    const pendingApts = appointments.filter(apt => apt.status === 'Pending');
    const upcomingApts = appointments.filter(apt => apt.status === 'Confirmed');
    const historyApts = appointments.filter(apt => ['Cancelled', 'Completed'].includes(apt.status));

    return (
        <div className="min-h-screen bg-indigo-50 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dr. {user.name} 👨‍⚕️</h1>
                    <p className="text-indigo-600 font-medium">Manage your patients and schedule</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-3 px-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Inbox size={18} /> Requests
                        {pendingApts.length > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs animate-pulse">{pendingApts.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`pb-3 px-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'schedule' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Calendar size={18} /> Schedule
                        {upcomingApts.length > 0 && <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">{upcomingApts.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 px-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <History size={18} /> History
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {activeTab === 'requests' && (
                        <div className="divide-y divide-gray-100">
                            {pendingApts.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <Inbox size={48} className="mx-auto mb-4 opacity-50" />
                                    No pending requests
                                </div>
                            ) : pendingApts.map(apt => (
                                <div key={apt._id} className="p-6 hover:bg-gray-50 transition flex flex-col lg:flex-row gap-6">
                                    {/* Patient Info Card */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                    {apt.patientId?.name}
                                                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {apt.patientId?.age} yrs, {apt.patientId?.gender}
                                                    </span>
                                                </h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(apt.date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><Clock size={14} /> {apt.time}</span>
                                                    <span className="flex items-center gap-1 text-red-500 font-medium">Blood Group: {apt.patientId?.bloodGroup || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                                            <p className="text-xs font-bold text-orange-700 mb-1">MEDICAL HISTORY</p>
                                            <p className="text-sm text-gray-700">{apt.patientId?.medicalHistory || "None provided"}</p>
                                        </div>

                                        <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 mb-1">SYMPTOMS REPORTED</p>
                                            <p className="text-sm text-gray-800">{apt.symptoms}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-3 lg:w-48 border-l pl-0 lg:pl-6 border-transparent lg:border-gray-100">
                                        <button
                                            onClick={() => handleStatusUpdate(apt._id, 'Confirmed')}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-sm shadow-indigo-200"
                                        >
                                            <CheckCircle size={18} /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                            className="bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="divide-y divide-gray-100">
                            {upcomingApts.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                                    No confirmed appointments
                                </div>
                            ) : upcomingApts.map(apt => (
                                <div key={apt._id} className="p-6 hover:bg-gray-50 transition flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex flex-col items-center justify-center font-bold">
                                                <span className="text-xs uppercase">{new Date(apt.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                <span className="text-2xl">{new Date(apt.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{apt.patientId?.name}</h3>
                                                <p className="text-indigo-600 font-medium flex items-center gap-2">
                                                    <Clock size={16} /> {apt.time}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                            className="border border-green-200 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Mark Completed
                                        </button>
                                    </div>

                                    {/* AI Summary Section */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-gray-700 text-sm">Clinical Insights</h4>
                                            {!apt.aiSummary && (
                                                <button
                                                    onClick={() => generateSummary(apt._id)}
                                                    disabled={loadingAi === apt._id}
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <Sparkles size={14} />
                                                    {loadingAi === apt._id ? 'Analyzing...' : 'Generate AI Summary'}
                                                </button>
                                            )}
                                        </div>
                                        {apt.aiSummary ? (
                                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                                <p className="text-indigo-900 text-sm leading-relaxed">{apt.aiSummary}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">Patient symptoms: {apt.symptoms}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="divide-y divide-gray-100">
                            {historyApts.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <History size={48} className="mx-auto mb-4 opacity-50" />
                                    No appointment history
                                </div>
                            ) : historyApts.map(apt => (
                                <div key={apt._id} className="p-6 opacity-75 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{apt.patientId?.name}</h3>
                                        <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
