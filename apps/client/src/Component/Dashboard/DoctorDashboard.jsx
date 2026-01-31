import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Sparkles, CheckCircle, XCircle, LogOut, Inbox, History, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from "../../config/constant";
import { Button, Card } from '../../components/ui';

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

    const tabs = [
        { id: 'requests', label: 'Requests', icon: <Inbox size={18} />, count: pendingApts.length },
        { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} />, count: upcomingApts.length },
        { id: 'history', label: 'History', icon: <History size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-indigo-50/50">
            {/* Header */}
            <header className="bg-white border-b border-indigo-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                            Dr
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Dr. {user.name}</h1>
                            <p className="text-xs text-indigo-600 font-medium">Doctor Dashboard</p>
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
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-indigo-100 mb-8 w-full md:w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-indigo-50'
                                }
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs animate-pulse ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'requests' && (
                    <div className="space-y-4 animate-slide-up">
                        {pendingApts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-indigo-50">
                                <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No pending appointment requests</p>
                            </div>
                        ) : pendingApts.map(apt => (
                            <Card key={apt._id} className="border-l-4 border-l-orange-400">
                                <div className="p-6 flex flex-col lg:flex-row gap-6">
                                    {/* Patient Info Card */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                                    {apt.patientId?.name?.[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                        {apt.patientId?.name}
                                                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                                            {apt.patientId?.age || 'N/A'} yrs, {apt.patientId?.gender || 'N/A'}
                                                        </span>
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(apt.date).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"><Clock size={14} /> {apt.time}</span>
                                                        <span className="flex items-center gap-1 text-red-500 font-medium bg-red-50 px-2 rounded-md">Blood: {apt.patientId?.bloodGroup || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                                            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                                <p className="text-xs font-bold text-orange-700 mb-1 uppercase tracking-wider">Medical History</p>
                                                <p className="text-sm text-gray-700">{apt.patientId?.medicalHistory || "None provided"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Symptoms Reported</p>
                                                <p className="text-sm text-gray-800">{apt.symptoms}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-3 lg:w-48 border-l-0 lg:border-l lg:pl-6 border-gray-100">
                                        <Button
                                            onClick={() => handleStatusUpdate(apt._id, 'Confirmed')}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-md"
                                            leftIcon={<CheckCircle size={18} />}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                            className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                            leftIcon={<XCircle size={18} />}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="space-y-4 animate-slide-up">
                        {upcomingApts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-indigo-50">
                                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No confirmed appointments scheduled.</p>
                            </div>
                        ) : upcomingApts.map(apt => (
                            <Card key={apt._id} className="overflow-visible">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex flex-col items-center justify-center font-bold border border-indigo-100">
                                                <span className="text-xs uppercase tracking-wide">{new Date(apt.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                <span className="text-2xl">{new Date(apt.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{apt.patientId?.name}</h3>
                                                <p className="text-indigo-600 font-medium flex items-center gap-2">
                                                    <Clock size={16} /> {apt.time}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                                            leftIcon={<CheckCircle size={16} />}
                                        >
                                            Mark Completed
                                        </Button>
                                    </div>

                                    {/* AI Summary Section */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative overflow-hidden group">
                                        <div className="flex justify-between items-center mb-3 relative z-10">
                                            <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                                <Sparkles size={14} className="text-indigo-500" /> Clinical Insights
                                            </h4>
                                            {!apt.aiSummary && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => generateSummary(apt._id)}
                                                    loading={loadingAi === apt._id}
                                                    disabled={loadingAi === apt._id}
                                                    className="text-indigo-600 hover:bg-indigo-50 text-xs h-8"
                                                >
                                                    Generate AI Summary
                                                </Button>
                                            )}
                                        </div>
                                        {apt.aiSummary ? (
                                            <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm relative z-10">
                                                <p className="text-indigo-900 text-sm leading-relaxed">{apt.aiSummary}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <p className="text-gray-500 text-sm italic"><span className="font-medium text-gray-700 not-italic">Patient symptoms:</span> {apt.symptoms}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4 animate-slide-up">
                        {historyApts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-indigo-50">
                                <History size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No appointment history</p>
                            </div>
                        ) : historyApts.map(apt => (
                            <div key={apt._id} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center justify-between opacity-75 hover:opacity-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{apt.patientId?.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {apt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
