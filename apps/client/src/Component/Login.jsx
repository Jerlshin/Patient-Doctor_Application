import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import { API_BASE_URL } from "../config/constant";

import { toast } from 'react-hot-toast';

// Note: This replaces the socket-based LoginPage for the initial auth flow.
// If socket auth is needed for chat, it can be handled in the Chat component or a context.
export default function Login() {
    const [role, setRole] = useState('user'); // 'user' or 'doctor'
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // POST to /login with role
            const response = await axios.post(`${API_BASE_URL}/doctors/login`, {
                ...formData,
                role
            });

            if (response.data) {
                // Store Token & User info
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Includes role

                toast.success(`Welcome back, ${response.data.user.name}!`);

                // Redirect based on role
                if (response.data.user.role === 'doctor') {
                    navigate('/doctor-dashboard');
                } else {
                    navigate('/dashboard'); // Patient Dashboard
                }
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setRole('user')}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'doctor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setRole('doctor')}
                    >
                        Doctor
                    </button>
                </div>



                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
