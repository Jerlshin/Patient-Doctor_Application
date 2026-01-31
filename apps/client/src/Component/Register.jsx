import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Stethoscope, Briefcase, MapPin, Droplet, Heart, Shield, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from "../config/constant";
import { toast } from 'react-hot-toast';
import { Button, Input, Card } from '../components/ui';

export default function Register() {
    const [role, setRole] = useState('user'); // 'user' (Patient) or 'doctor'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: 'Male',
        bloodGroup: '',
        medicalHistory: '',
        specialization: '',
        licenseNumber: '',
        experience: '',
        address: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const endpoint = `${API_BASE_URL}/doctors/register`;
            const payload = { ...formData, role: role };

            // For doctor registration, ensure specific fields are handled if needed by backend
            // The current backend likely handles dynamic fields based on role

            const response = await axios.post(endpoint, payload);

            if (response.data) {
                toast.success("Registration successful! Please login.");
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10 animate-slide-up">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                            <Stethoscope size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">MedEpoch</span>
                    </Link>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Create Account</h2>
                    <p className="text-gray-600 text-lg">Join our intelligent healthcare platform today</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Role Toggle */}
                    <div className="flex p-1.5 bg-gray-100/80 rounded-2xl mb-8">
                        <button
                            type="button"
                            className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'user' ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            onClick={() => setRole('user')}
                        >
                            <User size={18} />
                            Patient
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'doctor' ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            onClick={() => setRole('doctor')}
                        >
                            <Stethoscope size={18} />
                            Doctor
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Common Fields */}
                        <div className="space-y-6">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={role === 'doctor' ? "Dr. Jane Doe" : "Jane Doe"}
                                leftIcon={<User size={18} />}
                                required
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                leftIcon={<Mail size={18} />}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    required
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    leftIcon={<Shield size={18} />}
                                    required
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-sm text-gray-400 uppercase tracking-wider font-medium">
                                    {role === 'user' ? 'Personal Details' : 'Professional Info'}
                                </span>
                            </div>
                        </div>

                        {/* Role Specific Fields */}
                        {role === 'user' ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="Age"
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="25"
                                    />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Gender</label>
                                        <div className="relative">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-700 appearance-none"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Blood Group</label>
                                    <div className="relative">
                                        <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-700 appearance-none"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Medical History</label>
                                    <textarea
                                        name="medicalHistory"
                                        rows="3"
                                        value={formData.medicalHistory}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                        placeholder="Any allergies, chronic conditions, or past surgeries..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <Input
                                    label="Specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g. Cardiologist, Dermatologist"
                                    leftIcon={<Heart size={18} />}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="License Number"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="LIC-123456"
                                        leftIcon={<Briefcase size={18} />}
                                        required
                                    />
                                    <Input
                                        label="Experience (Years)"
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="e.g. 10"
                                        required
                                    />
                                </div>

                                <Input
                                    label="Clinic Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Health Ave, Medical District"
                                    leftIcon={<MapPin size={18} />}
                                />

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Professional Bio</label>
                                    <textarea
                                        name="bio"
                                        rows="3"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                        placeholder="Tell patients about your expertise and background..."
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                loading={loading}
                                rightIcon={!loading && <ArrowRight size={20} />}
                            >
                                {role === 'doctor' ? 'Register as Doctor' : 'Create Patient Account'}
                            </Button>
                        </div>
                    </form>

                    <p className="text-center mt-8 text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
