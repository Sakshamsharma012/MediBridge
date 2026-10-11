import React, { useState, useEffect } from 'react';
import { medicineService, alternativesService } from '../services/api';
import { Pill, Search, ShieldAlert, CheckCircle2, Sparkles, Leaf, Info, Flame, Droplet } from 'lucide-react';

const NATURAL_REMEDIES = [
  {
    category: 'Stomach Ulcer & Gas Problem',
    icon: '🍲',
    title: 'Jeera Water & Saunf (Fennel) Infusion',
    ingredients: 'Cumin seeds (Jeera), Fennel seeds (Saunf), Warm Water',
    preparation: 'Boil 1 tsp cumin seeds and 1 tsp fennel seeds in 300ml water for 5 minutes. Strain and sip warm on an empty stomach.',
    benefits: 'Neutralizes excess hydrochloric stomach acid, coats mucosal lining, prevents gas buildup, and alleviates ulcer burning sensation.',
  },
  {
    category: 'Acid Reflux & GERD',
    icon: '⚡',
    title: 'Tender Coconut Water & Ripe Banana',
    ingredients: 'Fresh Coconut Water, Ripe Yellow Banana',
    preparation: 'Consume 1 glass of fresh coconut water mid-morning, paired with 1 ripe banana.',
    benefits: 'Acts as a natural buffer against stomach acid and delivers potassium to soothe inflamed esophageal tissues.',
  },
  {
    category: 'Cold, Cough & Sore Throat',
    icon: '🍵',
    title: 'Ginger-Honey-Tulsi Warm Decoction',
    ingredients: 'Crushed Ginger, Fresh Tulsi (Holy Basil) Leaves, Raw Honey, Black Pepper',
    preparation: 'Simmer crushed ginger and 5 tulsi leaves in 250ml water for 7 minutes. Add a pinch of black pepper and 1 tsp honey before drinking.',
    benefits: 'Natural anti-microbial and anti-inflammatory properties relieve throat irritation, clear congestion, and boost immunity.',
  },
  {
    category: 'Joint Pain & Muscle Stiffness',
    icon: '🦴',
    title: 'Golden Turmeric Milk (Haldi Doodh)',
    ingredients: 'Organic Turmeric Powder (Haldi), Black Pepper, Warm Milk (or Almond Milk)',
    preparation: 'Warm 200ml milk with 1/2 tsp turmeric and a small pinch of black pepper (piperine enhances curcumin absorption by 2000%).',
    benefits: 'Curcumin suppresses pro-inflammatory cytokines, reducing synovial joint swelling and stiffness naturally.',
  },
  {
    category: 'High Blood Sugar & Diabetes Support',
    icon: '🩺',
    title: 'Soaked Fenugreek (Methi) Water',
    ingredients: 'Raw Fenugreek (Methi) Seeds, Water',
    preparation: 'Soak 1 tsp fenugreek seeds overnight in 1 glass of water. Drink the water and chew the seeds first thing in the morning.',
    benefits: 'High soluble fiber slows carbohydrate absorption and enhances insulin receptor sensitivity.',
  },
  {
    category: 'High Blood Pressure & Vascular Care',
    icon: '💓',
    title: 'Hibiscus Tea & Fresh Beetroot Juice',
    ingredients: 'Dried Hibiscus Flowers or Fresh Beetroot',
    preparation: 'Steep dried hibiscus in hot water for 5 mins, or drink 100ml fresh beetroot juice in the morning.',
    benefits: 'Rich in natural dietary nitrates that dilate vascular walls, promoting smooth blood flow and lowering systolic pressure.',
  },
];

export const GenericAlternatives = () => {
  const [query, setQuery] = useState('Paracetamol');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    setLoading(true);
    try {
      const res = await medicineService.search({ query: 'Paracetamol' });
      if (res?.success && res.data.medicines?.length > 0) {
        setMedicines(res.data.medicines);
        loadAlternatives(res.data.medicines[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await medicineService.search({ query });
      if (res?.success) {
        setMedicines(res.data.medicines);
        if (res.data.medicines.length > 0) {
          loadAlternatives(res.data.medicines[0].id);
        } else {
          setAlternatives([]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAlternatives = async (medId) => {
    try {
      const res = await alternativesService.getByMedicineId(medId);
      if (res?.success) {
        setSelectedMedicine(res.data.originalMedicine);
        setAlternatives(res.data.alternatives || []);
        setDisclaimer(res.disclaimer || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          <Leaf className="w-3.5 h-3.5 text-purple-600" /> Affordable Healthcare & Natural Wellness
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Pill className="w-8 h-8 text-purple-600" /> Generic Substitutes & Natural Homemade Tips
        </h1>
        <p className="text-xs text-slate-600">
          Find bioequivalent generic medicine alternatives with matching active ingredients alongside evidence-informed natural home remedies.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter brand name or medicine (e.g. Crocin, Glycomet, Omez)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button type="submit" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md">
          Find Match
        </button>
      </form>

      {/* Mandatory Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">MEDICAL NOTICE: </span>
          {disclaimer || 'Always consult a registered pharmacist or doctor before substituting prescription items. Natural home remedies support general wellness and should not replace acute emergency care.'}
        </div>
      </div>

      {/* Selected Target Medicine & Bioequivalent Alternatives */}
      {selectedMedicine && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Target Medicine Analyzed</span>
            <h2 className="text-2xl font-extrabold text-slate-900">{selectedMedicine.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div>Generic Name: <span className="font-bold text-slate-900">{selectedMedicine.genericName}</span></div>
              <div>Active Ingredient: <span className="font-bold text-slate-900">{selectedMedicine.activeIngredient}</span></div>
              <div>Strength: <span className="font-bold text-slate-900">{selectedMedicine.strength}</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Verified Generic Bioequivalent Substitutes
            </h3>

            {alternatives.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No generic alternative records found for this exact formulation.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{alt.medicineName || alt.genericName}</h4>
                        <div className="text-xs text-purple-700 font-semibold">{alt.genericName}</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-purple-600" />
                        {Math.round((alt.similarityScore || 0.95) * 100)}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{alt.notes}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                      <div>Manufacturer: <span className="font-semibold text-slate-800">{alt.manufacturer}</span></div>
                      <div>Rx Status: <span className="font-semibold text-slate-800">{alt.prescriptionStatus}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION: NATURAL HOMEMADE REMEDY TIPS GUIDE */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-emerald-100 border border-white/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Evidence-Informed Natural Wellness
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Natural Homemade Remedy Tips & Herbal Guidance
            </h2>
          </div>
          <span className="text-xs text-emerald-200">
            Simple kitchen ingredients for day-to-day relief
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {NATURAL_REMEDIES.map((rem, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{rem.icon}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  {rem.category}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-white">{rem.title}</h3>

              <div className="space-y-1.5 text-xs text-emerald-100">
                <div>
                  <strong className="text-white">Ingredients:</strong> {rem.ingredients}
                </div>
                <div>
                  <strong className="text-white">How to Prepare:</strong> {rem.preparation}
                </div>
              </div>

              <div className="text-[11px] text-emerald-200 pt-2 border-t border-white/10 flex items-start gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                <span>{rem.benefits}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
