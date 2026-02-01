import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Clock, Users, Stethoscope, Calendar } from 'lucide-react';
import { Button } from '../components/ui';


export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in-right">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart size={16} className="fill-current" />
                <span>Your Health, Our Priority</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Get <span className="gradient-text">Quick</span>
                <br />
                Medical Services
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                In today's fast-paced world, access to prompt and efficient medical services is paramount.
                When faced with a medical emergency or seeking immediate attention, our platform connects
                you with expert doctors instantly.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/register">
                  <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/doctor">
                  <Button variant="outline" size="lg">
                    Find Doctors
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Expert Doctors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Happy Patients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">4.9★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative lg:h-[600px] animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 h-full flex items-center justify-center">
                <div className="text-center space-y-8">
                  <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
                    <Stethoscope size={64} className="text-white" />
                  </div>

                  {/* Floating Cards */}
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <Shield size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Secure & Private</div>
                        <div className="text-sm text-gray-600">Your data is encrypted</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Clock size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">24/7 Available</div>
                        <div className="text-sm text-gray-600">Round-the-clock care</div>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Expert Doctors</div>
                        <div className="text-sm text-gray-600">Certified professionals</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MedEpoch?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience healthcare reimagined with our comprehensive platform designed for modern medical needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar />,
                title: 'Easy Booking',
                description: 'Schedule appointments with just a few clicks. Choose your preferred time and doctor.',
                color: 'blue'
              },
              {
                icon: <Stethoscope />,
                title: 'Expert Care',
                description: 'Access to certified and experienced medical professionals across specializations.',
                color: 'green'
              },
              {
                icon: <Shield />,
                title: 'Secure Platform',
                description: 'Your medical records and personal information are encrypted and protected.',
                color: 'purple'
              },
              {
                icon: <Heart />,
                title: 'AI Assistant',
                description: 'Get instant health advice and answers to your medical questions 24/7.',
                color: 'red'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(feature.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied patients who trust MedEpoch for their healthcare needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={20} />}>
                Create Account
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Try AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}