import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Stethoscope, Briefcase, MapPin, Droplet, Heart, Shield, ArrowRight, Upload, X, FileText, Camera, Check } from 'lucide-react';
import { API_BASE_URL } from "../config/constant";
import { toast } from 'react-hot-toast';
import { Button, Input } from '../components/ui';

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
    const [files, setFiles] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Profile Image Selection
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Document Files
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            // 1. Prepare Registration Data (Multipart)
            const registerData = new FormData();
            Object.keys(formData).forEach(key => registerData.append(key, formData[key]));
            registerData.append('role', role);
            if (profileImage) {
                registerData.append('profileImage', profileImage);
            }

            // 2. Register User
            const endpoint = `${API_BASE_URL}/doctors/register`;
            const response = await axios.post(endpoint, registerData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data) {
                const userId = response.data.user?._id || response.data._id;

                // 3. Upload Additional Documents if any
                if (files.length > 0 && userId) {
                    const uploadData = new FormData();
                    uploadData.append('userId', userId);
                    files.forEach(file => {
                        uploadData.append('documents', file);
                    });

                    await axios.post(`${API_BASE_URL}/doctors/upload-documents`, uploadData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    toast.success("Documents uploaded successfully!");
                }

                toast.success("Registration successful! Welcome aboard.");
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
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side - Creative Branding (Fixed) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>

                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                            <Stethoscope size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">MedEpoch</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Begin your journey to better health.</h1>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Join thousands of patients and doctors on the world's most advanced AI-powered healthcare platform.
                    </p>

                    <div className="flex gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-blue-600" />
                            ))}
                        </div>
                        <div className="text-sm font-medium pt-2.5">
                            <span className="text-white">Trusted by 10k+ users</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-blue-200">
                    © 2024 MedEpoch Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Scrollable Form */}
            <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto custom-scrollbar">
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 py-12">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-8 lg:text-left">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500">Enter your details to register</p>
                        </div>

                        {/* Role Toggle */}
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                            <button
                                type="button"
                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                onClick={() => setRole('user')}
                            >
                                <User size={18} />
                                Patient
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'doctor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                onClick={() => setRole('doctor')}
                            >
                                <Stethoscope size={18} />
                                Doctor
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Profile Image Upload */}
                            <div className="flex justify-center mb-6">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-white shadow-lg overflow-hidden relative">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition cursor-pointer">
                                        <Camera size={16} />
                                    </label>
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfileImageChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-3 bg-white text-xs text-gray-400 uppercase tracking-wider font-medium">
                                        Detailed Info
                                    </span>
                                </div>
                            </div>

                            {/* Role Specific Fields */}
                            {role === 'user' ? (
                                <div className="space-y-5 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-5">
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
                                        <label className="text-sm font-medium text-gray-700 ml-1">Bio</label>
                                        <textarea
                                            name="bio"
                                            rows="3"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Medical History</label>
                                        <textarea
                                            name="medicalHistory"
                                            rows="2"
                                            value={formData.medicalHistory}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                            placeholder="Any allergies, chronic conditions..."
                                        />
                                    </div>


                                    {/* Document Upload */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Upload Documents</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors bg-gray-50 text-center relative">
                                            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                            <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-400">PDF, PNG, JPG up to 5MB</p>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>

                                        {files.length > 0 && (
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {files.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg text-sm text-blue-800 border border-blue-100">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText size={14} />
                                                            <span className="truncate max-w-[200px]">{file.name}</span>
                                                        </div>
                                                        <button type="button" onClick={() => removeFile(index)} className="text-blue-500 hover:text-red-500 p-1">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 animate-fade-in">
                                    <Input
                                        label="Specialization"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        placeholder="e.g. Cardiologist, Dermatologist"
                                        leftIcon={<Heart size={18} />}
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    className="w-full py-3.5 text-lg shadow-lg hover:shadow-xl transition-all"
                                    loading={loading}
                                    rightIcon={!loading && <ArrowRight size={20} />}
                                >
                                    {role === 'doctor' ? 'Register as Doctor' : 'Create Patient Account'}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center mt-8 text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
