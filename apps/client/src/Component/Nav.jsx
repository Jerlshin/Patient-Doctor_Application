import { Link, useLocation } from "react-router-dom";
import { Stethoscope, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Nav() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if link is active
  const isActive = (path) => location.pathname === path;
  const linkClasses = (path) => `
    transition-all duration-200 font-medium px-3 py-2 rounded-lg
    ${isActive(path)
      ? 'text-blue-600 bg-blue-50'
      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }
  `;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/doctor', label: 'Doctors' },
    { path: '/bmi', label: 'BMI' },
    { path: '/reminder', label: 'Reminder' },
    { path: '/chatbot', label: 'AI Assistant' },
  ];

  return (
    <nav className={`
      sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b transition-all duration-300
      ${isScrolled ? 'shadow-md border-gray-200' : 'border-gray-100'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`
          flex justify-between items-center transition-all duration-300
          ${isScrolled ? 'h-14' : 'h-16'}
        `}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md">
              <Stethoscope size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">MedEpoch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={linkClasses(link.path)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all shadow-md"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block ${linkClasses(link.path)}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-gray-600 font-medium py-2 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
