import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FaPhoneAlt, FaUserMd, FaUser, FaSlidersH, FaSignOutAlt, FaBars, FaTimes, FaLeaf } from 'react-icons/fa';

const links = [
  { path: '/about', label: 'About' },
  { path: '/success-stories', label: 'Success Stories' },
  { path: '/doctors', label: 'Doctors' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/free-consultation', label: 'Free Callback' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'doctor') return '/doctor';
    return '/dashboard';
  };

  const getDashboardIcon = () => {
    if (user?.role === 'admin') return <FaSlidersH className="text-teal-600" />;
    if (user?.role === 'doctor') return <FaUserMd className="text-teal-600" />;
    return <FaUser className="text-teal-600" />;
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return 'Admin Panel';
    if (user?.role === 'doctor') return 'Doctor Portal';
    return 'Patient Portal';
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/85 backdrop-blur-lg border-slate-200/60 shadow-sm shadow-slate-100/30'
          : 'bg-white/40 backdrop-blur-xs border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <Link
          to="/"
          onClick={() => {
            setOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group"
          aria-label="HomeHub Homeopathy Home"
        >
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black flex items-center justify-center text-lg shadow-md shadow-teal-500/20 group-hover:scale-[1.03] transition-transform">
            H
          </span>
          <span className="leading-tight text-slate-800">
            <span className="font-extrabold text-slate-800 text-md block group-hover:text-teal-600 transition-colors">
              HomeHub <span className="font-light text-teal-600">Homeopathy</span>
            </span>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-bold">
              Safe • Natural • Root Cure
            </span>
          </span>
        </Link>
 
        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`hover:text-teal-600 transition-colors duration-150 whitespace-nowrap relative ${
                location.pathname === l.path ? 'text-teal-600 font-extrabold' : ''
              }`}
            >
              {l.label}
              {location.pathname === l.path && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
              )}
            </Link>
          ))}
          <Link
            to="/treatments"
            className={`hover:text-teal-600 transition-colors duration-150 whitespace-nowrap relative ${
              location.pathname === '/treatments' ? 'text-teal-600 font-extrabold' : ''
            }`}
          >
            Treatments
            {location.pathname === '/treatments' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
            )}
          </Link>
        </nav>
 
        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
 
          {/* Conditional Auth widgets */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-teal-700 text-xs font-black flex items-center justify-center cursor-pointer transition hover:shadow-md hover:shadow-teal-500/10"
                aria-label="User Profile"
              >
                {user?.name?.substring(0, 2).toUpperCase() || 'US'}
              </button>
 
              {showDropdown && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-100 rounded-xl shadow-2xl shadow-slate-200/40 p-1.5 z-50 animate-fadeIn">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Signed in as</span>
                    <span className="text-slate-800 text-sm font-semibold truncate block">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold truncate block">{user?.email}</span>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-teal-600 text-xs font-semibold transition"
                  >
                    {getDashboardIcon()}
                    <span>{getDashboardLabel()}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 rounded-lg text-rose-500 hover:bg-rose-50/50 text-xs font-semibold cursor-pointer transition"
                  >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-transparent hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs transition hover:text-teal-600"
            >
              Sign In
            </Link>
          )}
 
          <Link
            to="/booking"
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] btn-shimmer"
          >
            Book Slot
          </Link>
        </div>
 
        {/* Mobile toggle button */}
        <button
          className="md:hidden w-10 h-10 border border-slate-200 rounded-lg text-slate-700 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer hover:text-teal-600"
          aria-label="Toggle navigation drawer"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
 
      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-md z-45 flex flex-col p-6 space-y-6 border-b border-slate-200 animate-fadeIn overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-4 text-md font-bold text-slate-800">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className={`hover:text-teal-600 border-b border-slate-100 pb-2 flex items-center justify-between ${
                  location.pathname === l.path ? 'text-teal-600' : ''
                }`}
              >
                <span>{l.label}</span>
              </Link>
            ))}
            <Link
              to="/treatments"
              onClick={() => setOpen(false)}
              className={`hover:text-teal-600 border-b border-slate-100 pb-2 ${
                location.pathname === '/treatments' ? 'text-teal-600' : ''
              }`}
            >
              Treatments
            </Link>
          </nav>
 
          <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
            
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setOpen(false)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-center py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                >
                  {getDashboardIcon()}
                  {getDashboardLabel()}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-center py-2.5 rounded-lg font-bold text-sm"
              >
                Sign In
              </Link>
            )}
 
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold text-center py-2.5 rounded-lg text-sm transition shadow-sm"
            >
              Book Slot
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
