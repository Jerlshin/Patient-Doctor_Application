import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Stethoscope, Menu, X, User, LogOut, LayoutDashboard, 
  MessageSquare, Calendar, Users, ChevronDown 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    // Check local storage for user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowProfileMenu(false);
    navigate('/');
  };

  const NavLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm whitespace-nowrap
          ${isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
          }`}
      >
        {Icon && <Icon size={18} />}
        {label}
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm' 
        : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
              <Stethoscope size={24} />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                MedAI
              </span>
              <span className="text-xl font-display font-bold text-gray-800">Connect</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-200/50">
            <NavLink to="/" label="Home" />
            <NavLink to="/doctor" label="Find Doctors" icon={Users} />
            <NavLink to="/chatbot" label="AI Assistant" icon={MessageSquare} />
            {user && (
              <NavLink 
                to={user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} 
                label="Dashboard" 
                icon={LayoutDashboard} 
              />
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <span className="hidden sm:block text-sm font-semibold text-gray-700">
                    {user.name || 'User'}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-sm">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`hidden sm:block text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-slide-down">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                          {user.role === 'doctor' ? 'Doctor' : 'Patient'}
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to={user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={18} className="text-gray-400" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 text-gray-600 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <NavLink to="/" label="Home" />
            <NavLink to="/doctor" label="Find Doctors" icon={Users} />
            <NavLink to="/chatbot" label="AI Assistant" icon={MessageSquare} />
            {user && (
              <NavLink 
                to={user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} 
                label="Dashboard" 
                icon={LayoutDashboard} 
              />
            )}
            
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-red-600 font-medium px-4 py-2.5 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 text-gray-700 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}