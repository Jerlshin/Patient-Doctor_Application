import { Link, useLocation } from "react-router-dom";
import { Stethoscope } from 'lucide-react';

export function Nav() {
  const location = useLocation();

  // Check if link is active
  const isActive = (path) => location.pathname === path;
  const linkClasses = (path) => `transition-colors duration-200 font-medium ${isActive(path) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Stethoscope size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">MedEpoch</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClasses('/')}>Home</Link>
            <Link to="/about" className={linkClasses('/about')}>About Us</Link>
            <Link to="/doctor" className={linkClasses('/doctor')}>Doctors</Link>

            {/* Tools Dropdown Trigger or Group */}
            <div className="flex items-center space-x-6 border-l border-gray-200 pl-6 ml-2">
              <Link to="/bmi" className={linkClasses('/bmi')}>BMI</Link>
              <Link to="/reminder" className={linkClasses('/reminder')}>Reminder</Link>
              <Link to="/chat" className={linkClasses('/chat')}>Chat</Link>
              <Link to="/chatbot" className={linkClasses('/chatbot')}>AI Assistant</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-gray-600 font-medium hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}