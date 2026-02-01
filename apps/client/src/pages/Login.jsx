import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constant';
import toast from 'react-hot-toast';
import { 
  Mail, Lock, ArrowRight, User, Stethoscope, Eye, EyeOff, 
  Shield, Heart, Activity, Users, Star
} from 'lucide-react';
import { Button, Input } from '../components/ui';

export default function Login() {
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post(`${API_BASE_URL}/doctors/login`, {
        email: formData.email,
        password: formData.password,
        role: role
      });

      if (response.data.status) {
        toast.success(`Welcome back, ${response.data.user.name}!`);
        
        const userData = { ...response.data.user, role: role };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        
        setTimeout(() => {
          if (role === 'doctor') {
            navigate('/doctor-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 500);
      } else {
        toast.error(response.data.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.response?.data?.msg || 'Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      
      {/* Left Side - Brand & Visual */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          {/* Animated Orbs */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-1000" />
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          
          {/* Logo & Brand */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Activity size={24} className="text-blue-600" />
              </div>
              <span className="text-xl font-bold">MedAI Connect</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold leading-tight">
                Welcome<br />Back
              </h1>
              <p className="text-xl text-blue-100 max-w-md leading-relaxed">
                Access your personalized healthcare dashboard and connect with top medical professionals.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Bank-level security & encryption' },
                { icon: Users, text: '10,000+ healthcare professionals' },
                { icon: Heart, text: 'Trusted by millions worldwide' },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <item.icon size={20} />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/50 backdrop-blur-sm"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">Trusted by 10,000+ users</div>
                <div className="flex items-center gap-1 text-yellow-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-current" />
                  ))}
                  <span className="ml-1 text-white/80">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Activity size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MedAI Connect</span>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-900/10 p-8 lg:p-10 border border-gray-100">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign in to continue
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`relative py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    role === 'patient'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User size={18} />
                    <span>Patient</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`relative py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    role === 'doctor'
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Stethoscope size={18} />
                    <span>Doctor</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder={role === 'doctor' ? 'doctor@hospital.com' : 'patient@example.com'}
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail size={20} />}
                required
                autoComplete="email"
              />
              
              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    leftIcon={<Lock size={20} />}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button 
                type="submit" 
                fullWidth
                size="lg"
                loading={isLoading}
                rightIcon={!isLoading && <ArrowRight size={20} />}
                className="mt-6 !py-4"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
              >
                <span>Create new account</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8 px-4">
            Protected by enterprise-grade security. By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}