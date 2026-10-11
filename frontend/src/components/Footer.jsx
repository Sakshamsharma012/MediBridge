import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldAlert, Heart, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MediBridge</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bridging the gap between unused surplus medicines and eligible individuals in need, while facilitating local pharmacy and healthcare discovery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/donate" className="hover:text-brand-400 transition-colors">Donate Medicine</Link></li>
              <li><Link to="/map" className="hover:text-brand-400 transition-colors">Interactive Map</Link></li>
              <li><Link to="/alternatives" className="hover:text-brand-400 transition-colors">Generic Alternatives</Link></li>
            </ul>
          </div>

          {/* Healthcare Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Healthcare Hub</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/healthcare" className="hover:text-brand-400 transition-colors">First-Aid Guidance</Link></li>
              <li><Link to="/healthcare" className="hover:text-brand-400 transition-colors">Natural Self-Care</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Register as NGO / Hospital</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Pharmacy Registration</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Emergency</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" /> 100 Healthcare HQ Blvd, Metro City
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" /> Toll-Free Helpline: 1800-MED-BRIDGE
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" /> support@medibridge.org
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Safety & Medical Disclaimer Banner */}
        <div className="my-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200/90 text-xs leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">IMPORTANT HEALTHCARE DISCLAIMER: </span>
            This platform provides information for general educational and organizational assistance purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. For serious, persistent, or emergency symptoms, consult a qualified healthcare professional immediately. Expired, damaged, or unverified medicines are strictly ineligible for donation.
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MediBridge Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> for accessible healthcare.
          </div>
        </div>
      </div>
    </footer>
  );
};
