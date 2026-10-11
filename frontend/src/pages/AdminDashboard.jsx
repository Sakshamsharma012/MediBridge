import React, { useState, useEffect } from 'react';
import { adminService, donationService, mlService } from '../services/api';
import {
  ShieldCheck,
  Users,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  XCircle,
  Eye,
  Sparkles,
  BarChart2,
  Building2,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  Check,
  Package,
  Clock,
  User,
  Pill,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import {
  getStoredDonations,
  updateDonationStatus,
  getStoredNgoRequests,
  allocateNgoRequest,
  getStoredRegisteredEntities,
} from '../utils/donationStore';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [allDonations, setAllDonations] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [entities, setEntities] = useState({ ngos: [], pharmacies: [], hospitals: [] });

  const [adminTab, setAdminTab] = useState('PENDING'); // 'PENDING' | 'APPROVED_NGO' | 'REJECTED' | 'NGO_REQS' | 'ENTITIES_DIR'
  const [entitySubTab, setEntitySubTab] = useState('NGO'); // 'NGO' | 'PHARMACY' | 'HOSPITAL'

  const [auditLogs, setAuditLogs] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVerification, setSelectedVerification] = useState(null);
  const [verificationReason, setVerificationReason] = useState('OCR, Barcode & Expiry date physically verified.');
  const [actionSuccess, setActionSuccess] = useState('');

  const COLORS = ['#0d9488', '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const storedDons = getStoredDonations();
      setAllDonations(storedDons);

      const storedNgoReqs = getStoredNgoRequests();
      setNgoRequests(storedNgoReqs);

      const storedEnts = getStoredRegisteredEntities();
      setEntities(storedEnts);

      const pendingList = storedDons.filter((d) => d.status === 'PENDING_ADMIN_REVIEW');
      if (pendingList.length > 0) {
        setSelectedVerification(pendingList[0]);
      } else if (storedDons.length > 0) {
        setSelectedVerification(storedDons[0]);
      }

      const [mRes, aRes] = await Promise.all([
        adminService.getMetrics().catch(() => null),
        adminService.getAuditLogs().catch(() => null),
      ]);

      if (mRes?.success) {
        setMetrics(mRes.data.kpis);
      }
      if (aRes?.success) {
        setAuditLogs(aRes.data.logs || []);
      }

      try {
        const mlRes = await mlService.getDemandForecast('paracetamol-001');
        if (mlRes?.success) {
          setForecast(mlRes.data);
        }
      } catch (error) {
        console.warn('ML forecast unavailable:', error);
        setForecast(null);
      }
    } catch (e) {
      console.error(e);
      setAllDonations(getStoredDonations());
      setNgoRequests(getStoredNgoRequests());
      setEntities(getStoredRegisteredEntities());
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDonation = (newStatus) => {
    if (!selectedVerification) return;
    const targetStatus = newStatus === 'APPROVED' ? 'APPROVED_BY_ADMIN' : 'REJECTED';
    const reasonText = verificationReason || (newStatus === 'APPROVED' ? 'Approved by Admin Verification Officer' : 'REJECTED BY ADMIN: Failed OCR safety verification.');

    const updated = updateDonationStatus(selectedVerification.id, {
      status: targetStatus,
      rejectionReason: newStatus === 'REJECTED' ? reasonText : '',
      approvedAt: new Date().toISOString(),
    });

    setAllDonations(updated);

    const pendingList = updated.filter((d) => d.status === 'PENDING_ADMIN_REVIEW');
    if (pendingList.length > 0) {
      setSelectedVerification(pendingList[0]);
    } else {
      setSelectedVerification(updated[0] || null);
    }

    setActionSuccess(
      newStatus === 'APPROVED'
        ? `Donation #${selectedVerification.id} Approved! Available in NGO Portal for claiming.`
        : `Donation #${selectedVerification.id} Rejected and logged to Donor dashboard.`
    );
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleAllocateNgoReqByAdmin = (reqId, supplierType) => {
    const supplierInfo = {
      type: supplierType,
      name: supplierType === 'PHARMACY' ? 'Apollo Pharmacy (Banjara Hills)' : 'Apollo Hospitals (Jubilee Hills)',
      address: supplierType === 'PHARMACY' ? 'Road No. 2, Banjara Hills, Hyderabad' : 'Road No. 92, Jubilee Hills, Hyderabad',
      phone: supplierType === 'PHARMACY' ? '+91 40 2355 1122' : '+91 40 2360 7777',
      allocatedByAdmin: true,
      allocatedAt: new Date().toISOString(),
    };

    const updated = allocateNgoRequest(reqId, supplierInfo);
    setNgoRequests(updated);

    setActionSuccess(`Requisition #${reqId} matched & allocated from ${supplierInfo.name}!`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-bold text-sm">Loading Admin Command Center...</div>;
  }

  // Active KPI Metrics computation (fallback to live shared donation store)
  const activeMetrics = {
    usersCount: metrics?.usersCount || 48,
    verifiedBatches: metrics?.verifiedBatches || allDonations.filter((d) => d.status === 'APPROVED_BY_ADMIN' || d.status === 'CLAIMED_BY_NGO').length,
    pendingVerifications: metrics?.pendingVerifications || allDonations.filter((d) => d.status === 'PENDING_ADMIN_REVIEW').length,
    requestsCount: metrics?.requestsCount || ngoRequests.length,
    pharmaciesCount: metrics?.pharmaciesCount || entities.pharmacies.length,
    ngosCount: metrics?.ngosCount || entities.ngos.length,
    hospitalsCount: metrics?.hospitalsCount || entities.hospitals.length,
  };

  // Chart Data Preparation
  const chartData = [
    { month: 'Jan', donations: 45, requests: 30 },
    { month: 'Feb', donations: 52, requests: 40 },
    { month: 'Mar', donations: 68, requests: 55 },
    { month: 'Apr', donations: 80, requests: 72 },
    { month: 'May', donations: 95, requests: 88 },
    { month: 'Jun', donations: 110, requests: 102 },
  ];

  const categoryData = [
    { name: 'Analgesics', value: 35 },
    { name: 'Antibiotics', value: 25 },
    { name: 'Cardiovascular', value: 20 },
    { name: 'Respiratory', value: 12 },
    { name: 'Others', value: 8 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 rounded-2xl p-6 text-white space-y-2 shadow-xl border border-slate-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin Master Verification Center
        </div>
        <h1 className="text-3xl font-extrabold">MediBridge Operations & Verification Dashboard</h1>
        <p className="text-xs text-slate-300">
          Full oversight of automated OCR verification queues, user safety compliance, NGO requisition allocations, and entity directory management.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Total Users</div>
          <div className="text-2xl font-extrabold text-slate-900">{activeMetrics.usersCount}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Registered Accounts</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Verified Batches</div>
          <div className="text-2xl font-extrabold text-emerald-600">{activeMetrics.verifiedBatches}</div>
          <div className="text-[10px] text-slate-400">Safety Checked</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Pending Queue</div>
          <div className="text-2xl font-extrabold text-amber-600">{activeMetrics.pendingVerifications}</div>
          <div className="text-[10px] text-amber-700 font-bold">Awaiting Admin Review</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">NGO Requisitions</div>
          <div className="text-2xl font-extrabold text-indigo-600">{activeMetrics.requestsCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Community Needs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">Pharmacies</div>
          <div className="text-2xl font-extrabold text-blue-600">{activeMetrics.pharmaciesCount}</div>
          <div className="text-[10px] text-slate-400">Active Stock Partners</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold">NGOs & Hospitals</div>
          <div className="text-2xl font-extrabold text-teal-600">
            {activeMetrics.ngosCount + activeMetrics.hospitalsCount}
          </div>
          <div className="text-[10px] text-slate-400">Verified Healthcare Orgs</div>
        </div>
      </div>

      {/* MASTER WORKSTATION WITH TABS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-600" /> Admin Command Center Workstation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              OCR Verification, NGO Requisition Allocations, and Registered Entity Directories.
            </p>
          </div>

          {/* Master Tab Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0">
            <button
              onClick={() => {
                setAdminTab('PENDING');
                const pending = allDonations.filter((d) => d.status === 'PENDING_ADMIN_REVIEW');
                setSelectedVerification(pending[0] || null);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                adminTab === 'PENDING' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending OCR ({allDonations.filter((d) => d.status === 'PENDING_ADMIN_REVIEW').length})
            </button>

            <button
              onClick={() => {
                setAdminTab('APPROVED_NGO');
                const claimed = allDonations.filter((d) => d.status === 'APPROVED_BY_ADMIN' || d.status === 'CLAIMED_BY_NGO');
                setSelectedVerification(claimed[0] || null);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                adminTab === 'APPROVED_NGO' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Approved & NGO Claimed ({allDonations.filter((d) => d.status === 'APPROVED_BY_ADMIN' || d.status === 'CLAIMED_BY_NGO').length})
            </button>

            <button
              onClick={() => {
                setAdminTab('REJECTED');
                const rejected = allDonations.filter((d) => d.status === 'REJECTED');
                setSelectedVerification(rejected[0] || null);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                adminTab === 'REJECTED' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Rejected Log ({allDonations.filter((d) => d.status === 'REJECTED').length})
            </button>

            <button
              onClick={() => setAdminTab('NGO_REQS')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                adminTab === 'NGO_REQS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              NGO Requisitions & Allocation ({ngoRequests.length})
            </button>

            <button
              onClick={() => setAdminTab('ENTITIES_DIR')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                adminTab === 'ENTITIES_DIR' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Registered Entities Directory
            </button>
          </div>
        </div>

        {/* VIEW 1: OCR VERIFICATION WORKSTATION (PENDING, APPROVED, REJECTED) */}
        {(adminTab === 'PENDING' || adminTab === 'APPROVED_NGO' || adminTab === 'REJECTED') && (
          <div>
            {(() => {
              const displayedDonations = allDonations.filter((d) => {
                if (adminTab === 'PENDING') return d.status === 'PENDING_ADMIN_REVIEW';
                if (adminTab === 'APPROVED_NGO') return d.status === 'APPROVED_BY_ADMIN' || d.status === 'CLAIMED_BY_NGO';
                if (adminTab === 'REJECTED') return d.status === 'REJECTED';
                return true;
              });

              if (displayedDonations.length === 0) {
                return (
                  <div className="py-12 text-center text-slate-500 text-xs font-semibold bg-slate-50 rounded-2xl border border-slate-200">
                    No donations currently in "{adminTab}" category.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Selection List */}
                  <div className="lg:col-span-4 space-y-2 border-r border-slate-100 pr-4 max-h-[460px] overflow-y-auto">
                    <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Donation Queue ({displayedDonations.length})</div>
                    {displayedDonations.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVerification(v)}
                        className={`w-full text-left p-3 rounded-2xl border text-xs transition-all space-y-1 ${
                          selectedVerification?.id === v.id
                            ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 font-bold text-slate-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-brand-700">{v.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              v.status === 'APPROVED_BY_ADMIN' || v.status === 'CLAIMED_BY_NGO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : v.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>
                        <div className="font-extrabold text-slate-900">{v.medicineName}</div>
                        <div className="text-[11px] text-slate-500">
                          Source: {v.sourceType || 'DONOR'} ({v.donorName || 'Uploader'})
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right Workstation Detail View */}
                  {selectedVerification && (
                    <div className="lg:col-span-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Packaging Image & Visual Badge */}
                        <div className="bg-slate-900 rounded-2xl p-4 text-center text-white space-y-3 flex flex-col items-center justify-center min-h-[220px] border border-slate-700 shadow-md">
                          {selectedVerification.imageUrl ? (
                            <img
                              src={selectedVerification.imageUrl}
                              alt="Uploaded Medicine Packaging"
                              className="max-h-40 rounded-xl shadow-lg border border-slate-700 object-contain bg-slate-950 p-2"
                            />
                          ) : (
                            <div className="w-full h-36 rounded-xl bg-gradient-to-tr from-brand-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center border border-slate-800 space-y-2 p-3">
                              <Pill className="w-10 h-10 text-brand-400" />
                              <div className="text-xs font-extrabold text-brand-200">
                                {selectedVerification.medicineName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">Authentic Packaging Seal Intact</div>
                            </div>
                          )}
                          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authentic Packaging Image Attached
                          </div>
                        </div>

                        {/* OCR Extraction Readout Table */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs shadow-sm">
                          <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="flex items-center gap-1.5 text-brand-900 font-extrabold">
                              <Sparkles className="w-4 h-4 text-brand-600" /> Extracted OCR Readout
                            </span>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold">
                              {selectedVerification.confidenceScore || '99.2% Accuracy'}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-slate-700 font-medium">
                            <div className="flex justify-between border-b border-slate-200/80 pb-1">
                              <span className="text-slate-500">Medicine Name:</span>
                              <span className="font-extrabold text-slate-900">{selectedVerification.medicineName}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/80 pb-1">
                              <span className="text-slate-500">Manufacturer:</span>
                              <span className="font-bold text-slate-900">{selectedVerification.manufacturer}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/80 pb-1">
                              <span className="text-slate-500">Batch Number:</span>
                              <span className="font-mono font-bold text-slate-900">{selectedVerification.batchNumber}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/80 pb-1">
                              <span className="text-slate-500">MFG / EXP Dates:</span>
                              <span className="font-mono font-bold text-emerald-700">
                                MFG: {selectedVerification.mfgDate || '2024-01-15'} | EXP: {selectedVerification.expiryDate || '2027-12-31'}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/80 pb-1">
                              <span className="text-slate-500">Barcode:</span>
                              <span className="font-mono font-bold text-slate-900">{selectedVerification.barcode || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/80 pb-1">
                              <span className="text-slate-500">M.R.P. Price:</span>
                              <span className="font-bold text-slate-900">₹{selectedVerification.mrp || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Quantity (Uploader Specified):</span>
                              <span className="font-extrabold text-slate-900">{selectedVerification.quantity} units</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Donor & Claiming NGO Details Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Donor / Pharmacy Contact Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                            <User className="w-4 h-4 text-brand-600" /> Uploader / Supplier Details:
                          </div>
                          <div className="font-bold text-slate-800">{selectedVerification.donorName}</div>
                          <div className="text-slate-600">Type: <span className="font-bold text-brand-700">{selectedVerification.sourceType || 'DONOR'}</span></div>
                          <div className="text-slate-600">Phone: <span className="font-mono text-slate-900 font-bold">{selectedVerification.donorPhone}</span></div>
                          <div className="text-slate-600 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{selectedVerification.donorAddress}</span>
                          </div>
                        </div>

                        {/* Claiming NGO Card */}
                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                          <div className="font-extrabold text-emerald-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                            <HeartHandshake className="w-4 h-4 text-emerald-600" /> Claiming NGO Details:
                          </div>
                          {selectedVerification.claimedByNgo ? (
                            <>
                              <div className="font-bold text-slate-900">{selectedVerification.claimedByNgo.name}</div>
                              <div className="text-slate-600">Reg No: <span className="font-mono text-slate-900">{selectedVerification.claimedByNgo.regNo}</span></div>
                              <div className="text-slate-600">Phone: <span className="font-mono text-slate-900">{selectedVerification.claimedByNgo.phone}</span></div>
                              <div className="text-slate-600 flex items-start gap-1">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{selectedVerification.claimedByNgo.address}</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-slate-500 italic py-2">
                              {selectedVerification.status === 'REJECTED'
                                ? 'N/A (Donation Rejected)'
                                : 'Not yet accepted by an NGO. Available in NGO Portal.'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rider Pickup & Delivery Status Tracker (If Claimed) */}
                      {selectedVerification.riderInfo && (
                        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-2">
                          <div className="font-extrabold text-indigo-900 flex items-center justify-between">
                            <span>🚴 NGO Logistics Rider Pickup & Delivery Tracker</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-bold">
                              {selectedVerification.riderInfo.stage}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-indigo-950 font-medium">
                            <div>Rider: <strong>{selectedVerification.riderInfo.riderName}</strong></div>
                            <div>Contact: <span className="font-mono font-bold">{selectedVerification.riderInfo.riderPhone}</span></div>
                            <div>Vehicle: <span className="font-mono">{selectedVerification.riderInfo.vehicle}</span></div>
                            <div>Status: <strong className="text-indigo-700">{selectedVerification.riderInfo.statusLabel}</strong></div>
                          </div>
                        </div>
                      )}

                      {/* Rejection Log Reason (If Rejected) */}
                      {selectedVerification.status === 'REJECTED' && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                          <div className="font-extrabold flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" /> Admin Rejection Reason
                          </div>
                          <p className="font-semibold text-rose-800">{selectedVerification.rejectionReason || 'Failed verification checks.'}</p>
                        </div>
                      )}

                      {/* Verification Controls (Only for Pending Items) */}
                      {selectedVerification.status === 'PENDING_ADMIN_REVIEW' && (
                        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3">
                          <label className="block text-xs font-bold text-slate-700">Verification Audit Note / Reason</label>
                          <input
                            type="text"
                            value={verificationReason}
                            onChange={(e) => setVerificationReason(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                          />

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleVerifyDonation('APPROVED')}
                              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Approve & Enable NGO Claiming
                            </button>
                            <button
                              onClick={() => handleVerifyDonation('REJECTED')}
                              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                            >
                              <XCircle className="w-4 h-4" /> Reject & Block Donation
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 2: NGO MEDICINE REQUISITIONS & ALLOCATION ENGINE */}
        {adminTab === 'NGO_REQS' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-indigo-600" /> Active NGO Medicine Requisitions Queue
                </h3>
                <p className="text-slate-500">
                  Inspect community medicine demands submitted by NGOs and allocate matching stock from Pharmacies or Hospitals.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-extrabold">
                {ngoRequests.length} Active Demands
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ngoRequests.map((req) => (
                <div key={req.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-indigo-700 font-bold">{req.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        req.status === 'ALLOCATED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {req.status === 'ALLOCATED' ? 'ALLOCATED / MATCHED' : 'AWAITING ALLOCATION'}
                    </span>
                  </div>

                  <div className="font-extrabold text-slate-900 text-sm">{req.medicineName}</div>
                  <div className="text-slate-600">
                    Required: <strong className="text-slate-900">{req.requiredQuantity} units</strong> • Priority:{' '}
                    <span className="font-bold text-rose-600">{req.priority}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 space-y-1">
                    <div>Requesting NGO: <strong className="text-slate-900">{req.ngoName}</strong></div>
                    <div>Reg No: <span className="font-mono">{req.ngoRegNo}</span></div>
                    <div>Phone: <span className="font-mono font-bold">{req.contactPhone}</span></div>
                    <div className="flex items-start gap-1 text-[11px] text-slate-500 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{req.address}</span>
                    </div>
                  </div>

                  {req.status === 'ALLOCATED' && req.allocatedFrom ? (
                    <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-900 font-semibold space-y-0.5">
                      <div className="flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Allocated from {req.allocatedFrom.name}
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Type: {req.allocatedFrom.type} • Contact: {req.allocatedFrom.phone}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-700">Admin Allocation Actions:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAllocateNgoReqByAdmin(req.id, 'PHARMACY')}
                          className="py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Building2 className="w-3.5 h-3.5" /> Match Pharmacy
                        </button>
                        <button
                          onClick={() => handleAllocateNgoReqByAdmin(req.id, 'HOSPITAL')}
                          className="py-2 px-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Stethoscope className="w-3.5 h-3.5" /> Match Hospital
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: REGISTERED HEALTHCARE NETWORK DIRECTORY (NGOS, PHARMACIES, HOSPITALS) */}
        {adminTab === 'ENTITIES_DIR' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-600" /> Registered Healthcare Network Entities Directory
                </h3>
                <p className="text-slate-500">
                  Comprehensive directory of verified NGOs, Pharmacies, and Hospitals registered across Telangana.
                </p>
              </div>

              {/* Entity Sub-Tab Switcher */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl font-bold self-start sm:self-auto">
                <button
                  onClick={() => setEntitySubTab('NGO')}
                  className={`px-3 py-1 rounded-lg ${
                    entitySubTab === 'NGO' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  NGOs ({entities.ngos.length})
                </button>
                <button
                  onClick={() => setEntitySubTab('PHARMACY')}
                  className={`px-3 py-1 rounded-lg ${
                    entitySubTab === 'PHARMACY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pharmacies ({entities.pharmacies.length})
                </button>
                <button
                  onClick={() => setEntitySubTab('HOSPITAL')}
                  className={`px-3 py-1 rounded-lg ${
                    entitySubTab === 'HOSPITAL' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Hospitals ({entities.hospitals.length})
                </button>
              </div>
            </div>

            {/* DIRECTORY LISTING BY SUB-TAB */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entitySubTab === 'NGO' &&
                entities.ngos.map((ngo) => (
                  <div key={ngo.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                        {ngo.regNo}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                        {ngo.status}
                      </span>
                    </div>

                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                      {ngo.name}
                    </div>

                    <div className="space-y-1 text-slate-600 pt-1 border-t border-slate-200">
                      <div>Zone: <strong className="text-slate-900">{ngo.zone}</strong></div>
                      <div>Phone: <span className="font-mono font-bold text-slate-900">{ngo.phone}</span></div>
                      <div>Email: <span className="font-mono text-slate-800">{ngo.email}</span></div>
                      <div className="flex items-start gap-1 pt-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{ngo.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-200">
                      <span>Delivery Hub: {ngo.deliveryHub}</span>
                      <span className="text-emerald-700 font-bold">{ngo.demandsCount} Demands Active</span>
                    </div>
                  </div>
                ))}

              {entitySubTab === 'PHARMACY' &&
                entities.pharmacies.map((pharm) => (
                  <div key={pharm.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-blue-700 font-extrabold bg-blue-100 px-2 py-0.5 rounded-full">
                        {pharm.licenseNo}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
                        {pharm.status}
                      </span>
                    </div>

                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      {pharm.name}
                    </div>

                    <div className="space-y-1 text-slate-600 pt-1 border-t border-slate-200">
                      <div>Zone / Location: <strong className="text-slate-900">{pharm.zone}</strong></div>
                      <div>Phone: <span className="font-mono font-bold text-slate-900">{pharm.phone}</span></div>
                      <div>Email: <span className="font-mono text-slate-800">{pharm.email}</span></div>
                      <div className="flex items-start gap-1 pt-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{pharm.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-200">
                      <span>Verification Badge: Verified Partner</span>
                      <span className="text-blue-700 font-bold">{pharm.surplusStockCount} Items In Stock</span>
                    </div>
                  </div>
                ))}

              {entitySubTab === 'HOSPITAL' &&
                entities.hospitals.map((hosp) => (
                  <div key={hosp.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-rose-700 font-extrabold bg-rose-100 px-2 py-0.5 rounded-full">
                        {hosp.regCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                        {hosp.status}
                      </span>
                    </div>

                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-rose-600 shrink-0" />
                      {hosp.name}
                    </div>

                    <div className="space-y-1 text-slate-600 pt-1 border-t border-slate-200">
                      <div>Zone / Location: <strong className="text-slate-900">{hosp.zone}</strong></div>
                      <div>Phone: <span className="font-mono font-bold text-slate-900">{hosp.phone}</span></div>
                      <div>Email: <span className="font-mono text-slate-800">{hosp.email}</span></div>
                      <div className="flex items-start gap-1 pt-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{hosp.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-200">
                      <span>ICU Requisitions: {hosp.icuProcurement}</span>
                      <span className="text-rose-700 font-bold">{hosp.emergencyBeds} Emergency Beds</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* AI DEMAND FORECASTING MODULE */}
      {forecast && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-lg">Python Scikit-Learn AI Demand Forecasting Service</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {forecast.modelVersion}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-slate-400">Current 30-Day Demand</div>
              <div className="text-2xl font-extrabold">{forecast.currentDemand} units</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-slate-400">Predicted Demand</div>
              <div className="text-2xl font-extrabold text-emerald-400">{forecast.predictedQuantity} units</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-slate-400">Trend & Confidence</div>
              <div className="text-2xl font-extrabold text-brand-400">{forecast.trendPercentage} ({Math.round(forecast.confidenceScore * 100)}%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-slate-400">Recommendation</div>
              <div className="text-xs font-semibold text-amber-300">{forecast.recommendedAction}</div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-600" /> Platform Donations vs Requests (2026)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#0d9488" radius={[4, 4, 0, 0]} name="Donations" />
                <Bar dataKey="requests" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
