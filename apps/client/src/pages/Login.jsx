import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constant';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { Button, Input } from '../components/ui';

export default function Login() {
    const [role, setRole] = useState('user'); // 'user' (Patient) or 'doctor'
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            // Determine endpoint based on role for clarity, though backend might handle logic
            const endpoint = role === 'doctor' ? `${API_BASE_URL}/doctors/login` : `${API_BASE_URL}/users/login`;
            
            // NOTE: In your original code, you might be using a unified login or specific. 
            // Ensure this endpoint matches your backend route exactly.
            // If your backend uses /users for everyone, adjust accordingly.
            
            const response = await axios.post(`${API_BASE_URL}/doctors/login`, formData); 
            // ^ Using the endpoint from your uploaded file. Adjust if patients use a different one.

            toast.success(`Welcome back, ${response.data.user?.name || 'User'}!`);
            localStorage.setItem('token', response.data.token);
            // Inject selected role into storage if backend doesn't return it explicitly
            const userWithRole = { ...response.data.user, role: response.data.user.role || role };
            localStorage.setItem('user', JSON.stringify(userWithRole));

            setTimeout(() => {
                navigate(userWithRole.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
            }, 1000);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 lg:p-0">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-6xl grid lg:grid-cols-2 min-h-[650px]">
                
                {/* Left Side - Visual & Branding */}
                <div className="relative hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white overflow-hidden">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-8">
                            <ShieldCheck size={16} className="text-blue-400" />
                            <span>Secure & Private Portal</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">MediConnect</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md">
                            Access your medical records, connect with specialists, and manage your health journey securely.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mt-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-white">AI-Powered Diagnostics</p>
                                <p className="text-sm text-slate-400">Get preliminary insights instantly.</p>
                            </div>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 relative">
                     <div className="max-w-md mx-auto w-full">
                        
                        <div className="text-center lg:text-left mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
                            <p className="text-slate-500">Enter your credentials to access your account.</p>
                        </div>

                        {/* Role Selector Pill */}
                        <div className="bg-slate-100 p-1 rounded-xl flex mb-8">
                            <button
                                onClick={() => setRole('user')}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    role === 'user' 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Patient
                            </button>
                            <button
                                onClick={() => setRole('doctor')}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    role === 'doctor' 
                                    ? 'bg-white text-blue-700 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Doctor
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                icon={Mail}
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <div className="space-y-1">
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    icon={Lock}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="flex justify-end">
                                    <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full py-4 text-base font-semibold shadow-blue-500/25 hover:shadow-blue-500/40"
                                loading={isLoading}
                                rightIcon={!isLoading && <ArrowRight size={20} />}
                            >
                                Sign In as {role === 'doctor' ? 'Doctor' : 'Patient'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}