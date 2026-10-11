import React, { useState, useEffect } from 'react';
import { medicineService, requestService } from '../services/api';
import { Search, Filter, Pill, MapPin, CheckCircle, ShoppingBag, HeartHandshake, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MedicineSearch = () => {
  const { isLoggedIn, user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const categories = [
    'Analgesics',
    'Antibiotics',
    'Cardiovascular',
    'Respiratory',
    'Antidiabetic',
    'Antihistamines',
    'Gastrointestinal',
    'Vitamins & Supplements',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, category, prescriptionRequired]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = {
        query: query.trim() || undefined,
        category: category || undefined,
        prescriptionRequired: prescriptionRequired !== '' ? prescriptionRequired : undefined,
      };
      const res = await medicineService.search(params);
      if (res?.success) {
        setMedicines(res.data.medicines || []);
      }
    } catch (err) {
      setError('Failed to fetch medicine search results.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (medicine) => {
    if (!isLoggedIn) {
      alert('Please sign in to request donated surplus medicines.');
      return;
    }
    try {
      const res = await requestService.create({
        items: [{ medicineId: medicine.id, quantity: 1 }],
        reason: 'Essential medicine request via MediBridge Platform',
      });
      if (res?.success) {
        setActionSuccess(`Free medicine request submitted for ${medicine.name}!`);
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Search className="w-8 h-8 text-brand-600" /> Search Donated & Surplus Medicine Inventory
        </h1>
        <p className="text-xs text-slate-600">
          Search verified surplus donated medicines available for free community allocation or inspect local pharmacy stocks.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {/* Search Bar & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by medicine name, generic formulation, or active ingredient (e.g. Paracetamol, Amoxicillin)..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              category === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prescription filter toggle */}
        <div className="flex items-center gap-4 pt-2 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1 font-semibold text-slate-900">
            <Filter className="w-4 h-4 text-brand-600" /> Filters:
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="rx"
              checked={prescriptionRequired === ''}
              onChange={() => setPrescriptionRequired('')}
              className="text-brand-600"
            />
            All Items
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="rx"
              checked={prescriptionRequired === 'false'}
              onChange={() => setPrescriptionRequired('false')}
              className="text-brand-600"
            />
            Over-the-Counter (OTC)
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="rx"
              checked={prescriptionRequired === 'true'}
              onChange={() => setPrescriptionRequired('true')}
              className="text-brand-600"
            />
            Prescription Required (Rx)
          </label>
        </div>
      </div>

      {/* Search Results Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-bold text-xs">Searching medicine catalog...</div>
      ) : medicines.length === 0 ? (
        <div className="py-12 text-center space-y-2 bg-white rounded-3xl border border-slate-200 p-8">
          <Pill className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="font-bold text-slate-800 text-base">No Medicines Found</h3>
          <p className="text-xs text-slate-500">
            Try searching by generic active ingredient or select another category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <div key={med.id} className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{med.name}</h3>
                    <div className="text-xs text-brand-700 font-semibold">{med.genericName}</div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    med.prescriptionRequired ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {med.prescriptionRequired ? 'Rx Prescription' : 'OTC'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {med.description || `${med.dosageForm} ${med.strength} by ${med.manufacturer}`}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400">Strength:</span>{' '}
                    <span className="font-semibold text-slate-800">{med.strength}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Form:</span>{' '}
                    <span className="font-semibold text-slate-800">{med.dosageForm}</span>
                  </div>
                </div>

                {/* Availability Source Indicators */}
                <div className="space-y-1.5 pt-2">
                  {med.availability?.isDonationAvailable ? (
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4 text-emerald-600" /> Donated Free Surplus
                      </span>
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {med.availability.donatedCount} Available
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-slate-500" /> General Master Catalog
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">Standard</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleCreateRequest(med)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <HeartHandshake className="w-4 h-4" /> Request Free Donated Medicine
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
