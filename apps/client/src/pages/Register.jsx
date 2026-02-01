import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Stethoscope, Briefcase, MapPin, Droplet, Upload, 
  ArrowRight, Phone, FileText, CheckCircle2, Building, DollarSign, 
  Clock, Activity, Shield, Star, Eye, EyeOff, X
} from 'lucide-react';
import { API_BASE_URL } from "../config/constant";
import { toast } from 'react-hot-toast';
import { Button, Input } from '../components/ui';

export default function Register() {
  const [role, setRole] = useState('patient');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', address: '',
    // Patient Specific
    age: '', gender: 'Male', bloodGroup: '',
    medicalHistory: '', emergencyContact: '',
    // Doctor Specific
    specialization: '', licenseNumber: '', experience: '',
    bio: '', consultationFee: '', availableHours: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill in all required fields');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email');
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.phoneNumber || !formData.address) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }

    if (step === 3 && role === 'doctor') {
      if (!formData.specialization || !formData.licenseNumber || !formData.experience) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      const data = new FormData();
      
      // Append Common Fields
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', role);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('address', formData.address);

      if (profileImage) data.append('profileImage', profileImage);

      // Append Role-Specific Fields
      if (role === 'patient') {
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('bloodGroup', formData.bloodGroup);
        data.append('medicalHistory', formData.medicalHistory);
        data.append('emergencyContact', formData.emergencyContact);
      } else {
        data.append('specialization', formData.specialization);
        data.append('licenseNumber', formData.licenseNumber);
        data.append('experience', formData.experience);
        data.append('bio', formData.bio);
        data.append('consultationFee', formData.consultationFee);
        data.append('availableHours', formData.availableHours);
      }

      const response = await axios.post(`${API_BASE_URL}/doctors/register`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status) {
        toast.success(`Welcome, ${formData.name}! Account created successfully.`);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(response.data.msg || "Registration failed");
      }

    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.msg || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = role === 'patient' ? 3 : 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Activity size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MedAI Connect</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join thousands of users transforming healthcare</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Role Selection & Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
              
              {/* Role Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                  Account Type
                </h3>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('patient');
                      setCurrentStep(1);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      role === 'patient'
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        role === 'patient'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <User size={22} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${role === 'patient' ? 'text-blue-700' : 'text-gray-700'}`}>
                          Patient
                        </p>
                        <p className="text-xs text-gray-500">Book appointments & track health</p>
                      </div>
                      {role === 'patient' && (
                        <CheckCircle2 size={20} className="text-blue-600" />
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('doctor');
                      setCurrentStep(1);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      role === 'doctor'
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        role === 'doctor'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Stethoscope size={22} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${role === 'doctor' ? 'text-indigo-700' : 'text-gray-700'}`}>
                          Doctor
                        </p>
                        <p className="text-xs text-gray-500">Provide care & manage patients</p>
                      </div>
                      {role === 'doctor' && (
                        <CheckCircle2 size={20} className="text-indigo-600" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Progress Steps */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                  Registration Progress
                </h3>
                <div className="space-y-3">
                  {[
                    { num: 1, label: 'Account Details' },
                    { num: 2, label: 'Contact Information' },
                    { num: 3, label: role === 'doctor' ? 'Professional Info' : 'Medical History' },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        currentStep === step.num
                          ? role === 'doctor'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-blue-50 text-blue-700'
                          : currentStep > step.num
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        currentStep === step.num
                          ? role === 'doctor'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-blue-600 text-white'
                          : currentStep > step.num
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep > step.num ? <CheckCircle2 size={16} /> : step.num}
                      </div>
                      <span className="text-sm font-semibold">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Secure Registration</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Your data is encrypted and protected with enterprise-grade security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Account Details */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Details</h2>
                      <p className="text-gray-600">Create your login credentials</p>
                    </div>

                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      leftIcon={<User size={18} />}
                      required
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder={role === 'doctor' ? 'doctor@hospital.com' : 'patient@example.com'}
                      value={formData.email}
                      onChange={handleChange}
                      leftIcon={<Mail size={18} />}
                      required
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Input
                          label="Password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          leftIcon={<Lock size={18} />}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          label="Confirm Password"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          leftIcon={<Lock size={18} />}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                      <p className="text-gray-600">How can we reach you?</p>
                    </div>

                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      leftIcon={<Phone size={18} />}
                      required
                    />

                    <Input
                      label="Address"
                      name="address"
                      placeholder="123 Main St, City, State, ZIP"
                      value={formData.address}
                      onChange={handleChange}
                      leftIcon={<MapPin size={18} />}
                      required
                    />

                    {/* Profile Image Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Profile Photo (Optional)
                      </label>
                      
                      {previewImage ? (
                        <div className="relative inline-block">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-600">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Role-Specific Information */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    {role === 'patient' ? (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Information</h2>
                          <p className="text-gray-600">Help us provide better care</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Age"
                            name="age"
                            type="number"
                            placeholder="25"
                            value={formData.age}
                            onChange={handleChange}
                          />

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Gender
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <Input
                          label="Blood Group"
                          name="bloodGroup"
                          placeholder="O+"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          leftIcon={<Droplet size={18} />}
                        />

                        <Input
                          label="Emergency Contact"
                          name="emergencyContact"
                          placeholder="Name & Phone Number"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          leftIcon={<Phone size={18} />}
                        />

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Medical History (Optional)
                          </label>
                          <textarea
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            placeholder="Any known allergies, chronic conditions, past surgeries..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[120px] resize-none transition-all"
                          ></textarea>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h2>
                          <p className="text-gray-600">Tell us about your medical practice</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Specialization *
                            </label>
                            <select
                              name="specialization"
                              value={formData.specialization}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                            >
                              <option value="">Select Specialization</option>
                              <option value="General Physician">General Physician</option>
                              <option value="Cardiologist">Cardiologist</option>
                              <option value="Dermatologist">Dermatologist</option>
                              <option value="Neurologist">Neurologist</option>
                              <option value="Orthopedic">Orthopedic</option>
                              <option value="Pediatrician">Pediatrician</option>
                              <option value="Psychiatrist">Psychiatrist</option>
                              <option value="Surgeon">Surgeon</option>
                            </select>
                          </div>

                          <Input
                            label="Years of Experience"
                            name="experience"
                            type="number"
                            placeholder="5"
                            value={formData.experience}
                            onChange={handleChange}
                            leftIcon={<Briefcase size={18} />}
                            required
                          />
                        </div>

                        <Input
                          label="Medical License Number"
                          name="licenseNumber"
                          placeholder="LIC-123456"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          leftIcon={<FileText size={18} />}
                          required
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Consultation Fee ($)"
                            name="consultationFee"
                            type="number"
                            placeholder="50"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            leftIcon={<DollarSign size={18} />}
                          />

                          <Input
                            label="Available Hours"
                            name="availableHours"
                            placeholder="9 AM - 5 PM"
                            value={formData.availableHours}
                            onChange={handleChange}
                            leftIcon={<Clock size={18} />}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Professional Bio (Optional)
                          </label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell patients about your expertise, education, and approach to care..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[120px] resize-none transition-all"
                          ></textarea>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={prevStep}
                      className="px-6"
                    >
                      Back
                    </Button>
                  ) : (
                    <Link
                      to="/login"
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Already have an account?
                    </Link>
                  )}

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      rightIcon={<ArrowRight size={18} />}
                      className="px-8"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={loading}
                      rightIcon={!loading && <CheckCircle2 size={18} />}
                      className={`px-8 ${
                        role === 'doctor'
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : ''
                      }`}
                    >
                      {loading ? 'Creating Account...' : 'Complete Registration'}
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-600" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-500 fill-current" />
                <span>Trusted by 10K+ users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}