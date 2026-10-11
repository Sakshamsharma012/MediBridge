import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  Search,
  MapPin,
  Pill,
  BookOpen,
  User,
  LogOut,
  ShieldCheck,
  Building2,
  Stethoscope,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isLoggedIn, logout, role } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardRoute = () => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'PHARMACY':
        return '/pharmacy-dashboard';
      case 'NGO':
        return '/ngo-dashboard';
      case 'HOSPITAL':
        return '/hospital-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-700 via-indigo-700 to-brand-800 bg-clip-text text-transparent">
                MediBridge
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Healthcare Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            {(!isLoggedIn || role === 'USER' || role === 'DONOR') && (
              <>
                <Link to="/donate" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" /> Donate
                </Link>
                <Link to="/map" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
                </Link>
                <Link to="/alternatives" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <Pill className="w-4 h-4 text-purple-600" /> Generics & Remedies
                </Link>
                <Link to="/healthcare" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Healthcare Assistance
                </Link>
              </>
            )}

            {role === 'PHARMACY' && (
              <>
                <Link to="/pharmacy-dashboard" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors font-bold text-blue-700">
                  <Building2 className="w-4 h-4 text-blue-600" /> Pharmacy Inventory & OCR
                </Link>
                <Link to="/map" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
                </Link>
              </>
            )}

            {role === 'NGO' && (
              <>
                <Link to="/ngo-dashboard" className="hover:text-emerald-600 flex items-center gap-1.5 transition-colors font-bold text-emerald-700">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" /> NGO Requests Queue
                </Link>
                <Link to="/map" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
                </Link>
              </>
            )}

            {role === 'HOSPITAL' && (
              <>
                <Link to="/hospital-dashboard" className="hover:text-rose-600 flex items-center gap-1.5 transition-colors font-bold text-rose-700">
                  <Stethoscope className="w-4 h-4 text-rose-600" /> Hospital Procurement & Requisitions
                </Link>
                <Link to="/map" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
                </Link>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <Link to="/admin" className="hover:text-amber-600 flex items-center gap-1.5 transition-colors font-bold text-amber-700">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Platform Admin Portal
                </Link>
                <Link to="/map" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
                </Link>
              </>
            )}
          </nav>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardRoute()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200"
                >
                  {role === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-amber-600" />}
                  {role === 'PHARMACY' && <Building2 className="w-4 h-4 text-blue-600" />}
                  {role === 'NGO' && <HeartHandshake className="w-4 h-4 text-emerald-600" />}
                  {role === 'HOSPITAL' && <Stethoscope className="w-4 h-4 text-red-600" />}
                  {(role === 'USER' || role === 'DONOR') && <Sparkles className="w-4 h-4 text-emerald-600" />}
                  <span>{user.fullName || (role === 'USER' || role === 'DONOR' ? 'Donor / User' : role)} Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-md shadow-brand-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3">
          {(!isLoggedIn || role === 'USER' || role === 'DONOR') && (
            <>
              <Link
                to="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-600" /> Donate Medicines
              </Link>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <MapPin className="w-4 h-4 text-indigo-600" /> Map Discovery
              </Link>
              <Link
                to="/alternatives"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <Pill className="w-4 h-4 text-purple-600" /> Generic Alternatives
              </Link>
              <Link
                to="/healthcare"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <BookOpen className="w-4 h-4 text-blue-600" /> Healthcare Assistance
              </Link>
            </>
          )}

          {role === 'PHARMACY' && (
            <>
              <Link
                to="/pharmacy-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 font-bold text-blue-700"
              >
                <Building2 className="w-4 h-4 text-blue-600" /> Pharmacy Inventory & OCR
              </Link>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
              </Link>
            </>
          )}

          {role === 'NGO' && (
            <>
              <Link
                to="/ngo-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 font-bold text-emerald-700"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-600" /> NGO Requests Queue
              </Link>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
              </Link>
            </>
          )}

          {role === 'HOSPITAL' && (
            <>
              <Link
                to="/hospital-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 font-bold text-rose-700"
              >
                <Stethoscope className="w-4 h-4 text-rose-600" /> Hospital Procurement & Requisitions
              </Link>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
              </Link>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 font-bold text-amber-700"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Platform Overview
              </Link>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <MapPin className="w-4 h-4 text-indigo-600" /> Hyderabad Map
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-brand-600 text-white font-semibold rounded-lg"
                >
                  Go to Dashboard ({role === 'USER' || role === 'DONOR' ? 'Donor / User' : role})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2 bg-slate-100 text-red-600 font-semibold rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-slate-100 font-semibold text-slate-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-brand-600 font-semibold text-white rounded-lg"
                >
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
