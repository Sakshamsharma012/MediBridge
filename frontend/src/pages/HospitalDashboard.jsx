import React, { useState, useEffect } from 'react';
import { medicineService, requestService } from '../services/api';
import {
  Stethoscope,
  Building2,
  HeartHandshake,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Truck,
  Plus,
  AlertCircle,
  Package,
  ShieldCheck,
  Send,
  FileText,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStoredNgoRequests, allocateNgoRequest } from '../utils/donationStore';

export const HospitalDashboard = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Hospital Details
  const hospitalInfo = {
    name: user?.hospital?.name || 'Apollo Hospitals, Jubilee Hills, Hyderabad',
    licenseNo: user?.hospital?.licenseNumber || 'TS-HYD-HOSP-2026-9904',
    address: 'Road No. 92, Jubilee Hills, Hyderabad, Telangana - 500033',
    phone: '+91 40 2360 7777',
    emergencyContact: '+91 91234 56789 (Central ICU Requisition Desk)',
    department: 'Emergency & Critical Care Procurement Division',
  };

  // Pre-set detailed hospital emergency requests with origin NGO and destination details
  const [hospitalRequests, setHospitalRequests] = useState([
    {
      id: 'REQ-HOSP-HYD-101',
      date: '2026-10-05 14:30',
      priority: 'HIGH EMERGENCY',
      status: 'ALLOCATED',
      hospitalName: 'Apollo Hospitals, Jubilee Hills',
      receivingWard: 'Emergency ICU Care Unit - Block B (Ward 4B)',
      requestedFromNgo: {
        name: 'Helping Hands Foundation (NGO)',
        address: 'H.No 12-2-823, Mehdipatnam, Hyderabad, Telangana - 500028',
        phone: '+91 98490 12345',
        coordinator: 'Syed Hafiz (Relief Coordinator)',
      },
      items: [
        { name: 'Paracetamol 650mg IV Infusion', quantity: 50, batch: 'BATCH-HYD-P650' },
        { name: 'Amoxicillin 500mg Injections', quantity: 30, batch: 'BATCH-HYD-AMX500' },
      ],
      trackingNo: 'TRK-HYD-8829',
    },
    {
      id: 'REQ-HOSP-HYD-102',
      date: '2026-10-04 11:15',
      priority: 'URGENT ICU',
      status: 'DISPATCHED',
      hospitalName: 'KIMS Hospital, Secunderabad',
      receivingWard: 'Department of Trauma & Burn Emergency Medicine',
      requestedFromNgo: {
        name: 'Robin Hood Army NGO (Hyderabad Chapter)',
        address: 'Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034',
        phone: '+91 97012 34567',
        coordinator: 'Priya Sharma (NGO Dispatch Lead)',
      },
      items: [
        { name: 'Omeprazole 40mg IV Injections', quantity: 40, batch: 'BATCH-HYD-OMZ40' },
        { name: 'Ceftriaxone 1g Injection Vials', quantity: 25, batch: 'BATCH-HYD-CFT1G' },
      ],
      trackingNo: 'TRK-HYD-9912',
    },
    {
      id: 'REQ-HOSP-HYD-103',
      date: '2026-10-03 09:45',
      priority: 'STANDARD',
      status: 'RECEIVED AT HOSPITAL',
      hospitalName: 'Yashoda Hospitals, Malakpet',
      receivingWard: 'Pediatric Intensive Care Unit (PICU)',
      requestedFromNgo: {
        name: 'Akshaya Healthcare Trust NGO',
        address: 'Abids Circle, Hyderabad, Telangana - 500001',
        phone: '+91 91234 56789',
        coordinator: 'Ramesh Varma (Medical Officer)',
      },
      items: [
        { name: 'Azithromycin 250mg Oral Suspension', quantity: 60, batch: 'BATCH-HYD-AZT250' },
      ],
      trackingNo: 'TRK-HYD-7734',
    },
  ]);

  // Form State for creating new requisition
  const [targetNgo, setTargetNgo] = useState('Helping Hands Foundation (NGO) - Mehdipatnam');
  const [targetWard, setTargetWard] = useState('Emergency ICU Care Unit - Block B');
  const [selectedMed, setSelectedMed] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [priority, setPriority] = useState('HIGH EMERGENCY');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const medRes = await medicineService.search({ limit: 12 }).catch(() => null);
      if (medRes?.success) {
        setMedicines(medRes.data.medicines || []);
        if (medRes.data.medicines?.length > 0) {
          setSelectedMed(medRes.data.medicines[0].name);
        }
      }
      setNgoRequests(getStoredNgoRequests());
    } catch (e) {
      console.error(e);
      setNgoRequests(getStoredNgoRequests());
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateNgoReq = (reqId) => {
    const supplierInfo = {
      type: 'HOSPITAL',
      name: hospitalInfo.name,
      address: hospitalInfo.address,
      phone: hospitalInfo.phone,
    };
    const updated = allocateNgoRequest(reqId, supplierInfo);
    setNgoRequests(updated);

    setMessage(`NGO Requisition #${reqId} allocated successfully from Hospital Emergency Reserve!`);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleCreateRequisition = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-HOSP-HYD-${Math.floor(104 + Math.random() * 900)}`,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      priority,
      status: 'ALLOCATED',
      hospitalName: hospitalInfo.name,
      receivingWard: targetWard,
      requestedFromNgo: {
        name: targetNgo,
        address: targetNgo.includes('Mehdipatnam')
          ? 'H.No 12-2-823, Mehdipatnam, Hyderabad, Telangana - 500028'
          : targetNgo.includes('Banjara')
          ? 'Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034'
          : 'Abids Circle, Hyderabad, Telangana - 500001',
        phone: targetNgo.includes('Mehdipatnam') ? '+91 98490 12345' : '+91 97012 34567',
        coordinator: 'NGO Relief Logistics Desk',
      },
      items: [{ name: selectedMed || 'Paracetamol 650mg', quantity: parseInt(quantity, 10) }],
      trackingNo: `TRK-HYD-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setHospitalRequests([newReq, ...hospitalRequests]);
    setMessage(`Emergency Requisition #${newReq.id} submitted successfully to ${targetNgo}!`);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hospital Banner Header */}
      <div className="bg-gradient-to-r from-rose-700 via-red-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-rose-100 border border-white/20 mb-1">
              <Stethoscope className="w-3.5 h-3.5 text-rose-200" /> Hospital Emergency Procurement Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{hospitalInfo.name}</h1>
            <p className="text-xs text-rose-100 flex items-center gap-2">
              <span>License No: <strong className="font-mono text-white">{hospitalInfo.licenseNo}</strong></span>
              <span>•</span>
              <span>Telangana Health Authority Verified</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-1 shrink-0">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-300" /> Emergency Hotline: {hospitalInfo.phone}
            </div>
            <div className="text-rose-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-300" /> {hospitalInfo.address}
            </div>
          </div>
        </div>

        {/* Quick Hospital Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-rose-200 text-[11px] font-semibold">Active Hospital Requisitions</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{hospitalRequests.length} Requests</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-rose-200 text-[11px] font-semibold">Partner NGO Supplier Hubs</div>
            <div className="text-xl font-extrabold text-white mt-0.5">3 Active NGOs</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-rose-200 text-[11px] font-semibold">Emergency ICU Supply Status</div>
            <div className="text-xl font-extrabold text-emerald-300 mt-0.5">100% Operational</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-rose-200 text-[11px] font-semibold">Region / Location</div>
            <div className="text-xl font-extrabold text-white mt-0.5">Hyderabad, TS</div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Main Grid: Submit New Requisition + Active Hospital Requisition History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create New Emergency Requisition Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 h-fit">
          <div className="border-b border-slate-100 pb-3 space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" /> New Hospital Requisition
            </h2>
            <p className="text-xs text-slate-500">
              Submit bulk emergency medicine demand to verified partner NGOs across Hyderabad.
            </p>
          </div>

          <form onSubmit={handleCreateRequisition} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target NGO Supply Hub (From Where Requested) *</label>
              <select
                value={targetNgo}
                onChange={(e) => setTargetNgo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-slate-50"
              >
                <option value="Helping Hands Foundation (NGO) - Mehdipatnam">
                  Helping Hands Foundation (Mehdipatnam, Hyderabad)
                </option>
                <option value="Robin Hood Army NGO - Banjara Hills">
                  Robin Hood Army NGO (Banjara Hills, Hyderabad)
                </option>
                <option value="Akshaya Healthcare Trust NGO - Abids">
                  Akshaya Healthcare Trust NGO (Abids, Hyderabad)
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Receiving Hospital Department / Ward *</label>
              <input
                type="text"
                required
                value={targetWard}
                onChange={(e) => setTargetWard(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                placeholder="e.g. Emergency ICU Care Unit - Block B"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Required Medicine Formulation *</label>
              <select
                value={selectedMed}
                onChange={(e) => setSelectedMed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
              >
                {medicines.length > 0 ? (
                  medicines.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.strength})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Paracetamol 650mg IV Infusion">Paracetamol 650mg IV Infusion</option>
                    <option value="Amoxicillin 500mg Injection">Amoxicillin 500mg Injection</option>
                    <option value="Omeprazole 40mg IV Injection">Omeprazole 40mg IV Injection</option>
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity (Units) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-rose-700 bg-rose-50"
                >
                  <option value="HIGH EMERGENCY">HIGH EMERGENCY</option>
                  <option value="URGENT ICU">URGENT ICU</option>
                  <option value="STANDARD">STANDARD</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Bulk Requisition
            </button>
          </form>
        </div>

        {/* Right Column: Hospital Emergency Requisitions Queue (NGO Origin & Destination Details) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-rose-600" /> Active Hospital Emergency Requisitions Queue
              </h2>
              <p className="text-xs text-slate-500">
                Detailed tracking of requested emergency medicines, source NGO origin, and destination receiving ward.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 px-3 py-1 rounded-full bg-slate-100">
              {hospitalRequests.length} Total Records
            </span>
          </div>

          <div className="space-y-4">
            {hospitalRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow"
              >
                {/* Top Request ID Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-rose-700">{req.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.priority.includes('EMERGENCY')
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Requisition Date: {req.date}</div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 ${
                        req.status === 'RECEIVED AT HOSPITAL'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : req.status === 'DISPATCHED'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {req.status === 'RECEIVED AT HOSPITAL' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-indigo-600 animate-bounce" />
                      )}
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Grid: ORIGIN (FROM WHERE REQUESTED) vs DESTINATION (HOSPITAL WARD) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {/* Origin: NGO Details */}
                  <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-3">
                    <div className="font-extrabold text-teal-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <HeartHandshake className="w-4 h-4 text-teal-600" /> From Where Requested (NGO Origin):
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm">{req.requestedFromNgo.name}</div>
                    <div className="text-slate-600 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{req.requestedFromNgo.address}</span>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.requestedFromNgo.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      Coordinator: {req.requestedFromNgo.coordinator}
                    </div>
                  </div>

                  {/* Destination: Hospital Details & Ward */}
                  <div className="space-y-1.5 pl-0 md:pl-2">
                    <div className="font-extrabold text-rose-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <Building2 className="w-4 h-4 text-rose-600" /> Destination Hospital & Receiving Ward:
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm">{req.hospitalName}</div>
                    <div className="text-rose-900 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60 inline-block">
                      {req.receivingWard}
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Tracking Code: <span className="font-mono font-bold text-slate-800">{req.trackingNo}</span>
                    </div>
                  </div>
                </div>

                {/* Requested Medicine Items Table */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="font-extrabold text-slate-800">Requested Medicines & Quantities:</div>
                  <div className="space-y-1.5">
                    {req.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-rose-600" />
                          <span className="font-bold text-slate-900">{item.name}</span>
                          {item.batch && (
                            <span className="font-mono text-[11px] text-slate-500">({item.batch})</span>
                          )}
                        </div>
                        <div className="font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                          {item.quantity} Units
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIVE NGO COMMUNITY MEDICINE REQUISITIONS (HOSPITAL ALLOCATION VIEW) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-rose-600" /> Active NGO Relief Demands Across Telangana
                </h3>
                <p className="text-xs text-slate-500">
                  Hospitals can inspect community medicine requisitions submitted by NGOs and allocate emergency reserve stock directly.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-extrabold text-xs self-start sm:self-auto">
                {ngoRequests.filter((r) => r.status === 'REQUESTED').length} Active NGO Requisitions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {ngoRequests.map((ngoReq) => (
                <div key={ngoReq.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-rose-700 font-bold">{ngoReq.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        ngoReq.status === 'ALLOCATED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {ngoReq.status === 'ALLOCATED' ? 'ALLOCATED / MATCHED' : 'OPEN FOR ALLOCATION'}
                    </span>
                  </div>

                  <div className="font-extrabold text-slate-900 text-sm">{ngoReq.medicineName}</div>
                  <div className="text-slate-600">
                    Required: <strong className="text-slate-900">{ngoReq.requiredQuantity} units</strong> • Priority:{' '}
                    <span className="font-bold text-rose-600">{ngoReq.priority}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 space-y-1">
                    <div>
                      Requesting NGO: <strong className="text-slate-900">{ngoReq.ngoName}</strong>
                    </div>
                    <div>Phone: <span className="font-mono font-bold">{ngoReq.contactPhone}</span></div>
                    <div className="flex items-start gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{ngoReq.address}</span>
                    </div>
                  </div>

                  {ngoReq.status === 'ALLOCATED' && ngoReq.allocatedFrom ? (
                    <div className="p-2 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-[11px] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      Allocated from {ngoReq.allocatedFrom.name} ({ngoReq.allocatedFrom.type})
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAllocateNgoReq(ngoReq.id)}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" /> Allocate & Fulfill from Hospital Emergency Stock
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
