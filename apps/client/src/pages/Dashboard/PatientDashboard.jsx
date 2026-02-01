import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Activity,
    Calendar,
    FileText,
    TrendingUp,
    User,
    Heart,
    Droplets,
    Thermometer,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Search,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, subtext, color, trend, trendValue }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={80} />
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trendValue}
            </div>
        </div>
        <div className="relative z-10">
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
        </div>
    </div>
);

const AppointmentItem = ({ doctor, specialty, time, date, status }) => {
    const statusStyles = {
        confirmed: "bg-green-100 text-green-700",
        pending: "bg-amber-100 text-amber-700",
        cancelled: "bg-red-100 text-red-700"
    };

    return (
        <div className="flex items-center gap-4 p-4 hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
            <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200 group-hover:rotate-3 transition-transform">
                    {doctor.split(' ').pop().charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                    <ShieldCheck size={12} className="text-blue-600" />
                </div>
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{doctor}</h4>
                <p className="text-xs font-medium text-slate-500">{specialty}</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
                    {status}
                </span>
                <p className="text-sm font-bold text-slate-700">{time}</p>
                <p className="text-xs font-medium text-slate-400">{date}</p>
            </div>
        </div>
    );
};

export default function PatientDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Top Header / Action Bar */}
                <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1 w-8 bg-blue-600 rounded-full"></span>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Patient Portal</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
                            Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name || 'Patient'}</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Your personal health dashboard and clinical records.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-full md:w-64 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="primary" className="shadow-blue-200 shadow-xl" onClick={() => navigate('/doctor')}>
                            <Plus size={18} className="mr-2" /> Book Now
                        </Button>
                    </div>
                </div>

                {/* Vital Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-slide-up">
                    <MetricCard
                        icon={Heart}
                        label="Pulse Rate"
                        value="72"
                        subtext="BPM (Resting)"
                        color="bg-rose-500"
                        trend="down"
                        trendValue="3%"
                    />
                    <MetricCard
                        icon={Droplets}
                        label="Blood Sugar"
                        value="105"
                        subtext="mg/dL (Fasting)"
                        color="bg-blue-500"
                        trend="up"
                        trendValue="1.2%"
                    />
                    <MetricCard
                        icon={Activity}
                        label="Daily Steps"
                        value="8,420"
                        subtext="Target: 10k"
                        color="bg-indigo-600"
                        trend="up"
                        trendValue="15%"
                    />
                    <MetricCard
                        icon={Thermometer}
                        label="Body Temp"
                        value="98.4°"
                        subtext="Fahrenheit"
                        color="bg-teal-500"
                        trend="down"
                        trendValue="0.2%"
                    />
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Appointments Column */}
                    <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <Card
                            header={
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <Calendar size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">Schedule</h3>
                                    </div>
                                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                                        View Full Calendar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            }
                            className="border-none shadow-xl shadow-slate-200/50"
                        >
                            <div className="grid grid-cols-1 gap-1">
                                <AppointmentItem doctor="Dr. Sarah Wilson" specialty="Cardiology Specialist" time="10:00 AM" date="Today, Oct 22" status="confirmed" />
                                <AppointmentItem doctor="Dr. Emily Chen" specialty="Senior Dermatologist" time="02:30 PM" date="Tomorrow, Oct 23" status="pending" />
                                <AppointmentItem doctor="Dr. James Carter" specialty="General Practitioner" time="09:15 AM" date="Wed, Oct 24" status="confirmed" />
                            </div>
                        </Card>

                        {/* Health Analytics Placeholder */}
                        <Card header={<h3 className="text-lg font-bold text-slate-800">Health Trends (Weekly)</h3>}>
                            <div className="h-48 flex items-end gap-3 px-2">
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                        <div
                                            className="w-full bg-slate-100 rounded-t-lg relative overflow-hidden transition-all duration-500 group-hover:bg-blue-50"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute bottom-0 left-0 right-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ height: '30%' }}></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>

                        {/* AI Assistant Promo Card */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                                    <TrendingUp size={12} className="text-blue-400" /> AI Powered
                                </div>
                                <h3 className="text-2xl font-bold mb-3 leading-tight">Instant AI Diagnosis</h3>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">Feeling unwell? Our advanced AI engine can analyze your symptoms in seconds.</p>
                                <Button
                                    onClick={() => navigate('/chatbot')}
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700 border-none h-12 rounded-2xl font-bold shadow-lg shadow-blue-600/20"
                                >
                                    Start Chat Now
                                </Button>
                            </div>
                        </div>

                        {/* Quick Files Section */}
                        <Card
                            header={<h3 className="font-bold text-slate-800">Recent Documents</h3>}
                            className="border-none shadow-lg shadow-slate-200/50"
                        >
                            <div className="space-y-4">
                                {[
                                    { name: "Lab_Results_Oct.pdf", type: "Blood Test", date: "2 days ago" },
                                    { name: "Prescription_Cardio.pdf", type: "Prescription", date: "5 days ago" }
                                ].map((file, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors group">
                                        <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-xl transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{file.type} • {file.date}</p>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-blue-600">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors text-center">
                                    View all documents
                                </button>
                            </div>
                        </Card>

                        {/* Help/Support Section */}
                        <div className="bg-blue-50 p-6 rounded-3xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-blue-900">24/7 Support</h4>
                                <p className="text-xs font-medium text-blue-700/70">Connect with a triage nurse instantly.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}