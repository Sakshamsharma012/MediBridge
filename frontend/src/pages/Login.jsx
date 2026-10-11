import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  User,
  Building2,
  HeartHandshake,
  Sparkles,
  Lock,
  Mail,
  AlertCircle,
  Phone,
  MapPin,
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !phone.trim() || !address.trim()) {
      setError('Please provide email, password, phone number, and address. All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const user = await login({
        email,
        password,
        phone: phone.trim(),
        address: address.trim(),
      });
      redirectRole(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (
    demoEmail,
    demoPhone = '+1 (555) 019-2834',
    demoAddress = '100 Health Plaza, Metro City'
  ) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setPhone(demoPhone);
    setAddress(demoAddress);
    setError('');
    setLoading(true);
    try {
      const user = await login({
        email: demoEmail,
        password: 'Password123!',
        phone: demoPhone,
        address: demoAddress,
      });
      redirectRole(user.role);
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const redirectRole = (role) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'PHARMACY':
        navigate('/pharmacy-dashboard');
        break;
      case 'NGO':
        navigate('/ngo-dashboard');
        break;
      case 'HOSPITAL':
        navigate('/hospital-dashboard');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your MediBridge healthcare account</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@medibridge.org"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Required for emergency verification and order dispatch.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address / Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Health Ave, Apt 4B, Metro City"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Required for location-based medicine routing & delivery.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* DEMO QUICK LOGIN BUTTONS */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            ⚡ Quick Demo Accounts Login
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                handleDemoLogin(
                  'admin@medibridge.org',
                  '+1 (555) 019-2834',
                  '100 Admin HQ Blvd, Central City'
                )
              }
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold flex items-center gap-1.5 justify-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Admin Demo
            </button>

            <button
              type="button"
              onClick={() =>
                handleDemoLogin(
                  'donor@medibridge.org',
                  '+91 98490 12345',
                  '14 Hope Street, Banjara Hills, Hyderabad'
                )
              }
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-1.5 justify-center col-span-2 sm:col-span-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Donor / User Demo
            </button>

            <button
              type="button"
              onClick={() =>
                handleDemoLogin(
                  'pharmacy@medibridge.org',
                  '+91 98765 43210',
                  '88 Pharma Boulevard, Abids, Hyderabad'
                )
              }
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-semibold flex items-center gap-1.5 justify-center"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Pharmacy Demo
            </button>

            <button
              type="button"
              onClick={() =>
                handleDemoLogin(
                  'ngo@medibridge.org',
                  '+91 97012 34567',
                  '45 NGO Relief Way, Mehdipatnam, Hyderabad'
                )
              }
              className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-semibold flex items-center gap-1.5 justify-center"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-teal-600" /> NGO Demo
            </button>

          </div>
        </div>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};
