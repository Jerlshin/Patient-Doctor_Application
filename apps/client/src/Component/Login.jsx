import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constant';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Stethoscope, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui';


export default function Login() {
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
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
            const endpoint = `${API_BASE_URL}/doctors/login`;

            const response = await axios.post(endpoint, formData);

            toast.success(`Welcome back${response.data.user?.name ? ', ' + response.data.user.name : ''}!`);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({ ...response.data.user, role }));

            setTimeout(() => {
                navigate(role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
            }, 500);
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo Header */}
                <div className="text-center mb-8 animate-slide-up">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                            <Stethoscope size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-2xl text-gray-900">MedEpoch</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to continue to your dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Role Tabs */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('user')}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${role === 'user'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <User size={18} />
                            <span>Patient</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('doctor')}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${role === 'doctor'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Stethoscope size={18} />
                            <span>Doctor</span>
                        </button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            name="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<Mail size={20} />}
                            required
                        />

                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                leftIcon={<Lock size={20} />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-6"
                            loading={isLoading}
                            rightIcon={!isLoading && <ArrowRight size={20} />}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <Link to="/register">
                        <Button variant="outline" size="lg" className="w-full">
                            Create Account
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    By signing in, you agree to our{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}
