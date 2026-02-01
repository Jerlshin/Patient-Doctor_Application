import { Link, useLocation, useNavigate } from "react-router-dom";
import { Stethoscope, Menu, X, User, LogOut, LayoutDashboard, MessageSquare, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock user for now, replace with your context/localStorage logic
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    // Check local storage for user
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const NavLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm
          ${isActive
            ? 'bg-blue-50 text-blue-600 shadow-sm'
            : 'text-slate-600 hover:bg-white hover:text-blue-500 hover:shadow-sm'
          }`}
      >
        {Icon && <Icon size={18} />}
        {label}
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b 
      ${isScrolled ? 'glass border-white/20 h-16' : 'bg-transparent border-transparent h-20'}`}>

      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl text-white shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
            <Stethoscope size={24} />
          </div>
          <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            MedAI<span className="text-blue-600">Connect</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
          <NavLink to="/" label="Home" />
          <NavLink to="/doctor" label="Find Doctors" />
          <NavLink to="/chatbot" label="AI Assistant" icon={MessageSquare} />
          {user && <NavLink to="/dashboard" label="Dashboard" icon={LayoutDashboard} />}
        </div>

        {/* Auth / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  {user.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full rounded-full object-cover" />
                  ) : <User size={16} />}
                </div>
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-slide-up flex flex-col">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <User size={16} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left w-full">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 bg-white rounded-xl shadow-sm border border-slate-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-4 md:hidden animate-slide-down flex flex-col gap-2">
          <NavLink to="/" label="Home" />
          <NavLink to="/doctor" label="Doctors" />
          <NavLink to="/chatbot" label="AI Assistant" />
          <NavLink to="/dashboard" label="Dashboard" />
          <div className="h-px bg-slate-100 my-2" />
          {user ? (
            <button onClick={handleLogout} className="text-red-500 font-medium px-4 py-2 text-left">Logout</button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-center py-2 text-slate-600 font-medium border border-slate-200 rounded-xl">Login</Link>
              <Link to="/register" className="text-center py-2 bg-blue-600 text-white font-medium rounded-xl">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}