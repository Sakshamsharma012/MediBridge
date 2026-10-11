import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Building2, HeartHandshake, Sparkles, Lock, Mail, AlertCircle, Phone, MapPin } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('USER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !phone.trim() || !address.trim()) {
      setError('Full name, email, password, phone number, and address are required.');
      return;
    }

    // Indian Phone format validation (+91 standard)
    const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    const isIndianPhone = /^(\+91|91|0)?[6-9]\d{9}$/.test(cleanPhone);
    if (!isIndianPhone) {
      setError('Please enter a valid 10-digit Indian phone number (e.g. +91 9876543210).');
      return;
    }

    // Format phone with +91 prefix if missing
    let formattedPhone = cleanPhone;
    if (cleanPhone.length === 10) {
      formattedPhone = `+91 ${cleanPhone}`;
    } else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      formattedPhone = `+91 ${cleanPhone.slice(2)}`;
    } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      formattedPhone = `+91 ${cleanPhone.slice(1)}`;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    // Pharmacy specific validation
    if (role === 'PHARMACY') {
      if (!orgName.trim() || !regNumber.trim()) {
        setError('Pharmacy License Number and Pharmacy Organization Name are strictly required for registration.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        email,
        password,
        fullName,
        phone: formattedPhone,
        address: address.trim(),
        role,
        organizationData: ['PHARMACY', 'NGO'].includes(role)
          ? {
              name: orgName.trim() || fullName,
              licenseNumber: regNumber.trim(),
              registrationNumber: regNumber.trim(),
              address: address.trim() || 'Telangana, India',
              city: 'Hyderabad',
              state: 'Telangana',
              zipCode: '500001',
            }
          : undefined,
      };

      const user = await register(payload);
      if (user.role === 'PHARMACY') navigate('/pharmacy-dashboard');
      else if (user.role === 'NGO') navigate('/ngo-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Create MediBridge Account</h2>
          <p className="text-xs text-slate-500">Choose your role and join our healthcare network</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Role Selector Grid */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Select Account Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'USER', label: 'User', icon: User },
{ id: 'PHARMACY', label: 'Pharmacy', icon: Building2 },
{ id: 'NGO', label: 'NGO / Non-Profit', icon: HeartHandshake },
            ].map((item) => {
              const Icon = item.icon;
              const selected = role === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    selected
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Contact Person</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address / Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Banjara Hills, Road No. 12, Hyderabad, Telangana"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {['PHARMACY', 'NGO'].includes(role) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Organization Credentials & Verification</span>
                {role === 'PHARMACY' && <span className="text-[10px] text-red-600 font-bold">* License Details Required</span>}
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Pharmacy / Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Apollo Pharmacy / MedPlus Express"
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Drug License / Registration No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. TS-HYD-PH-2026-8801"
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
