import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, Shield, Clock, Users, Stethoscope, 
  Calendar, MessageSquare, Star, CheckCircle, TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui';

export function Home() {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule appointments with just a few clicks. Choose your preferred time and doctor.',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Stethoscope,
      title: 'Expert Care',
      description: 'Access certified and experienced medical professionals across all specializations.',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your medical records and personal information are encrypted and fully protected.',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: '24/7 AI Assistant',
      description: 'Get instant health advice and answers to your medical questions anytime.',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  const stats = [
    { value: '500+', label: 'Expert Doctors', icon: Users },
    { value: '10K+', label: 'Happy Patients', icon: Heart },
    { value: '4.9★', label: 'Average Rating', icon: Star },
    { value: '24/7', label: 'Support', icon: Clock },
  ];

  const benefits = [
    'Instant appointment booking',
    'AI-powered symptom checker',
    'Secure video consultations',
    'Digital health records',
    'Prescription management',
    'Follow-up reminders'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-60 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="animate-slide-in-right space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                <Heart size={16} className="fill-current" />
                <span>Your Health, Our Priority</span>
              </div>

              <div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                  Get <span className="gradient-text">Quick</span>
                  <br />
                  Medical Services
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                  Connect with expert doctors instantly. Experience healthcare reimagined with 
                  AI-powered consultations, secure appointments, and 24/7 medical support.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/doctor">
                  <Button variant="outline" size="lg" leftIcon={<Users size={20} />}>
                    Find Doctors
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <stat.icon size={20} className="text-blue-600" />
                      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:h-[600px] animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl transform rotate-3 opacity-50" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 lg:p-10 h-full flex flex-col justify-center border border-gray-100">
                
                {/* Center Icon */}
                <div className="text-center mb-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <Stethoscope size={64} className="text-white" />
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="space-y-4">
                  {[
                    { icon: Shield, title: 'Secure & Private', desc: 'HIPAA compliant', color: 'green' },
                    { icon: Clock, title: '24/7 Available', desc: 'Round-the-clock care', color: 'blue' },
                    { icon: Users, title: 'Expert Doctors', desc: 'Certified professionals', color: 'purple' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`bg-${item.color}-50 border border-${item.color}-200 rounded-2xl p-4 flex items-center gap-4 animate-slide-up hover:scale-105 transition-transform cursor-pointer`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-12 h-12 bg-${item.color}-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
                        <item.icon size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </div>
                      <CheckCircle size={20} className={`ml-auto text-${item.color}-600`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <TrendingUp size={16} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Healthcare Made Simple
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of healthcare with our comprehensive platform designed for modern medical needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-tr ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-16 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Everything You Need in One Place
                </h2>
                <p className="text-lg text-blue-100 mb-8">
                  MedAI Connect provides a complete healthcare ecosystem with powerful features designed to make your health journey seamless.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-400 shrink-0" />
                      <span className="text-white/90">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold mb-2">100%</div>
                    <div className="text-blue-100">Patient Satisfaction</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Easy to Use</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Doctor Quality</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Support</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of satisfied patients who trust MedAI Connect for their healthcare needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="xl" rightIcon={<ArrowRight size={22} />}>
                Create Free Account
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button variant="outline" size="xl" leftIcon={<MessageSquare size={22} />}>
                Try AI Assistant
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            No credit card required • Free forever • HIPAA compliant
          </p>
        </div>
      </section>

    </div>
  );
}