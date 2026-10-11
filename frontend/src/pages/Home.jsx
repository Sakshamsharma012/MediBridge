import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Search,
  MapPin,
  ShieldCheck,
  Building2,
  Pill,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold border border-brand-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Empowering Accessible Healthcare & Reducing Medicine Waste
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Give Medicines a <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">Second Chance.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                MediBridge connects generous donors with verified NGOs, hospitals, and eligible individuals to safely redistribute unused medicines while integrating smart pharmacy discovery, OCR verification, and healthcare guidance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/donate"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <HeartHandshake className="w-5 h-5" /> Donate Unused Medicine
                </Link>

                <Link
                  to="/map"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <MapPin className="w-5 h-5" /> Hyderabad Map Discovery
                </Link>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-700">12,400+</div>
                  <div className="text-xs text-slate-500 font-medium">Medicines Verified</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-700">350+</div>
                  <div className="text-xs text-slate-500 font-medium">Verified Organizations</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-700">98.4%</div>
                  <div className="text-xs text-slate-500 font-medium">Verification Accuracy</div>
                </div>
              </div>
            </div>

            {/* Right Card Feature Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-800 text-sm">Smart Verification Status</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    VERIFIED & ELIGIBLE
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-500">Extracted Packaging Readout</div>
                  <div className="text-base font-bold text-slate-900">Paracetamol 500mg (Crocin)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div>Batch: <span className="font-mono text-slate-800 font-semibold">BATCH-2026-X9</span></div>
                    <div>Expiry: <span className="font-semibold text-emerald-700">12/2028</span></div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>OCR Text Match Score</span>
                    <span className="font-bold text-brand-700">95% High Confidence</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>Barcode Lookup</span>
                    <span className="font-mono font-semibold text-slate-800">8901087001122</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Nearest Source</span>
                    <span className="font-semibold text-slate-800">CityCare Pharmacy (1.2 km)</span>
                  </div>
                </div>

                <Link
                  to="/donate"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  Test Packaging Scanner <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Simplified Workflow</span>
          <h2 className="text-3xl font-extrabold text-slate-900">How MediBridge Works</h2>
          <p className="text-slate-600 text-sm">
            Four simple steps connecting donors, verification algorithms, NGOs, and healthcare seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-extrabold text-lg">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Donate Unused Medicine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Donors upload a picture of sealed, unexpired medicine packaging and scan the barcode.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">OCR & Expiry Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated OCR extracts batch & expiry data. Admin officers review side-by-side matches.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-lg">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">GPS Location Discovery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified medicine appears on interactive OpenStreetMap for nearby NGOs, hospitals & users.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold text-lg">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base">Request or Purchase</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Eligible seekers request donated items or purchase directly from verified local pharmacies.
            </p>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES GRID */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold">Complete Healthcare Ecosystem</h2>
            <p className="text-slate-400 text-sm">
              Combining medicine donation, smart inventory, AI demand prediction, and healthcare assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <MapPin className="w-8 h-8 text-brand-400" />
              <h3 className="text-lg font-bold">GPS Location Services</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Find nearby pharmacies, verified NGOs, hospitals, and donation centers calculated by distance using OpenStreetMap and Leaflet.
              </p>
              <Link to="/map" className="inline-flex items-center text-xs font-semibold text-brand-400 hover:underline">
                Explore Map <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <Pill className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-bold">Generic Substitutions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Discover cost-effective generic medicine alternatives matched strictly by active ingredient, dosage strength, and form.
              </p>
              <Link to="/alternatives" className="inline-flex items-center text-xs font-semibold text-purple-400 hover:underline">
                Find Generic Matches <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <BarChart3 className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold">AI Demand Forecasting</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integrated Python Scikit-Learn Machine Learning service predicting regional medicine demand to prevent critical shortages.
              </p>
              <Link to="/admin" className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:underline">
                View Admin Analytics <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTHCARE SAFETY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" /> Healthcare Safety & Compliance
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              MediBridge strictly enforces medicine safety. Expired, damaged, opened, or unverified medicines are completely blocked from donation listing. First-aid and self-care articles serve general educational guidance only and do not replace professional medical diagnosis.
            </p>
          </div>
          <Link
            to="/healthcare"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors"
          >
            Read Safety Guidelines
          </Link>
        </div>
      </section>
    </div>
  );
};
