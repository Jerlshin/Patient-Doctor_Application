import { Link, useLocation } from "react-router-dom";
import { Stethoscope, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from "../config/constant";

export function Nav() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Handle scroll and load user
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Load user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsMobileMenuOpen(false);
  };

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

          {/* CTA Buttons / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right mr-1">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={`${API_BASE_URL}/${user.profileImage.replace(/\\/g, '/')}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-blue-600" />
                  )}
                </div>
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 text-sm ml-2 font-medium"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <>
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
              </>
            )}
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
              {user ? (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={`${API_BASE_URL}/${user.profileImage.replace(/\\/g, '/')}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="ml-auto text-xs font-semibold text-red-500">Logout</button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
