import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Stethoscope, Briefcase, MapPin, Droplet, Upload, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from "../config/constant";
import { toast } from 'react-hot-toast';
import { Button, Input } from '../components/ui';

export default function Register() {
    const [role, setRole] = useState('user'); // 'user' (Patient) or 'doctor'
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        age: '', gender: 'Male', bloodGroup: '',
        medicalHistory: '', // Patient specific
        specialization: '', licenseNumber: '', experience: '', address: '', bio: '' // Doctor specific
    });
    
    // File states
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [resume, setResume] = useState(null); // Doctor
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e, setter, isImage = false) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
            if (isImage) {
                setPreviewImage(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setLoading(true);
        const data = new FormData();
        
        // Append common fields
        Object.keys(formData).forEach(key => {
            // Filter fields based on role to avoid sending empty irrelevant data
            if (role === 'user' && ['specialization', 'licenseNumber', 'experience', 'bio'].includes(key)) return;
            if (role === 'doctor' && ['medicalHistory'].includes(key)) return;
            data.append(key, formData[key]);
        });

        data.append('role', role);
        if (profileImage) data.append('profileImage', profileImage);
        if (role === 'doctor' && resume) data.append('resume', resume);

        try {
            const endpoint = `${API_BASE_URL}/users`; // Assuming unified endpoint or specific one
            // NOTE: Adjust endpoint if doctors register via /doctors/register
            
            await axios.post(endpoint, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            
            toast.success('Account created successfully!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-7xl flex flex-col lg:flex-row min-h-[800px]">
                
                {/* Left Side - Contextual Information */}
                <div className={`lg:w-2/5 p-12 text-white flex flex-col justify-between relative transition-colors duration-500 ${role === 'doctor' ? 'bg-slate-900' : 'bg-blue-600'}`}>
                     {/* Background Pattern */}
                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                     
                     <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-12">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <ArrowRight className="rotate-180" size={16} />
                            </div>
                            <span className="font-medium">Back to Home</span>
                        </Link>
                        
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            {role === 'doctor' ? 'Join our Network of Specialists' : 'Start Your Health Journey Today'}
                        </h1>
                        <p className="text-lg text-white/70 leading-relaxed">
                            {role === 'doctor' 
                                ? 'Connect with thousands of patients, manage appointments efficiently, and use AI tools to enhance your practice.'
                                : 'Get 24/7 access to top doctors, secure health records, and AI-powered health insights at your fingertips.'
                            }
                        </p>
                     </div>

                     <div className="relative z-10 mt-12 space-y-4">
                        {[
                            role === 'doctor' ? 'Verified Practitioner Badge' : 'Instant AI Consultation',
                            role === 'doctor' ? 'Smart Patient Management' : 'Secure Medical History',
                            role === 'doctor' ? 'Analytics Dashboard' : 'Medicine Reminders'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                <CheckCircle2 className="text-green-400" size={20} />
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:w-3/5 p-8 md:p-12 lg:p-16 overflow-y-auto max-h-[100vh] custom-scrollbar bg-white">
                    <div className="max-w-2xl mx-auto">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                                <p className="text-slate-500 mt-1">Fill in your details to get started.</p>
                            </div>
                            
                            {/* Role Toggle */}
                            <div className="bg-slate-100 p-1.5 rounded-xl inline-flex self-start sm:self-auto">
                                <button
                                    onClick={() => setRole('user')}
                                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                        role === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    Patient
                                </button>
                                <button
                                    onClick={() => setRole('doctor')}
                                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                        role === 'doctor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    Doctor
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Profile Image Upload */}
                            <div className="flex items-center gap-6">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                <User size={32} strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="profile-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl font-medium text-xs">
                                        Change
                                    </label>
                                    <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setProfileImage, true)} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Profile Photo</h3>
                                    <p className="text-xs text-slate-500 mt-1">Recommended: Square JPG, PNG. Max 2MB.</p>
                                </div>
                            </div>

                            {/* Section: Account Info */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Account Information</h3>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Input label="Full Name" name="name" icon={User} value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                    <Input label="Email Address" name="email" type="email" icon={Mail} value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Input label="Password" name="password" type="password" icon={Lock} value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                                    <Input label="Confirm Password" name="confirmPassword" type="password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />
                                </div>
                            </div>

                            {/* Section: Personal Details */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Personal Details</h3>
                                <div className="grid md:grid-cols-3 gap-5">
                                    <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required placeholder="25" />
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-600">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <Input label="Blood Group" name="bloodGroup" icon={Droplet} value={formData.bloodGroup} onChange={handleChange} required placeholder="O+" />
                                </div>
                            </div>

                            {/* Section: Role Specifics */}
                            {role === 'doctor' ? (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Professional Credentials</h3>
                                    
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-700">Specialization</label>
                                            <div className="relative">
                                                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-600 appearance-none">
                                                    <option value="">Select Specialization</option>
                                                    <option value="Cardiologist">Cardiologist</option>
                                                    <option value="Dermatologist">Dermatologist</option>
                                                    <option value="Neurologist">Neurologist</option>
                                                    <option value="Pediatrician">Pediatrician</option>
                                                    <option value="General Physician">General Physician</option>
                                                </select>
                                            </div>
                                        </div>
                                        <Input label="Years of Experience" name="experience" icon={Briefcase} type="number" value={formData.experience} onChange={handleChange} required placeholder="e.g. 8" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                         <Input label="License Number" name="licenseNumber" icon={Briefcase} value={formData.licenseNumber} onChange={handleChange} required placeholder="MED-123456" />
                                         <Input label="Clinic/Hospital Address" name="address" icon={MapPin} value={formData.address} onChange={handleChange} required placeholder="123 Health St." />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Professional Bio</label>
                                        <textarea 
                                            name="bio" 
                                            value={formData.bio} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                                            placeholder="Briefly describe your expertise..."
                                        ></textarea>
                                    </div>

                                    <div className="p-5 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700 text-sm">Upload Medical License / Resume</p>
                                                    <p className="text-xs text-slate-500">{resume ? resume.name : 'PDF or JPG (Max 5MB)'}</p>
                                                </div>
                                            </div>
                                            <label className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 cursor-pointer transition-colors">
                                                Browse
                                                <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, setResume)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Medical Profile</h3>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Medical History (Optional)</label>
                                        <textarea 
                                            name="medicalHistory" 
                                            value={formData.medicalHistory} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                                            placeholder="Any existing conditions, allergies, or past surgeries..."
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className={`w-full py-4 text-lg shadow-xl transition-all ${role === 'doctor' ? 'shadow-slate-900/20 hover:shadow-slate-900/30 bg-slate-900 hover:bg-slate-800' : 'shadow-blue-500/25 hover:shadow-blue-500/40 bg-blue-600 hover:bg-blue-700'}`}
                                    loading={loading}
                                    rightIcon={!loading && <ArrowRight size={20} />}
                                >
                                    {role === 'doctor' ? 'Submit Application' : 'Create Patient Account'}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center mt-8 text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className={`font-bold hover:underline ${role === 'doctor' ? 'text-slate-900' : 'text-blue-600'}`}>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}