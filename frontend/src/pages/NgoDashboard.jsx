import React, { useState, useEffect } from 'react';
import { requestService, medicineService, donationService } from '../services/api';
import {
  HeartHandshake,
  Package,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Clock,
  User,
  MapPin,
  Sparkles,
  Check,
  Send,
  Building2,
  Plus,
  ShieldCheck,
  Pill,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStoredDonations, updateDonationStatus, getStoredNgoRequests, addNgoRequest } from '../utils/donationStore';

export const NgoDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('SURPLUS'); // 'SURPLUS' | 'REQUESTS' | 'NEW_REQ'
  const [requests, setRequests] = useState([]);
  const [approvedInventory, setApprovedInventory] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Requisition Form State
  const [reqMedicineName, setReqMedicineName] = useState('Okacet 10 (Cetirizine 10mg)');
  const [reqQuantity, setReqQuantity] = useState(50);
  const [reqPriority, setReqPriority] = useState('HIGH');
  const [reqReason, setReqReason] = useState('Primary Healthcare Center Relief Supply');
  const [reqDestination, setReqDestination] = useState('Telangana Community Rural Clinic');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Donations are still backed by the existing local donation store.
      const sharedDons = getStoredDonations();
      const verifiedSurplus = sharedDons.filter(
        (d) => d.status === 'APPROVED_BY_ADMIN' || d.status === 'CLAIMED_BY_NGO'
      );
      setApprovedInventory(verifiedSurplus);

      // Medicine requests must come from the backend so NGO approvals update
      // the same database record the requester sees.
      const response = await requestService.getAllRequests();
      const apiRequests =
  response?.data?.data?.requests ??
  response?.data?.requests ??
  response?.requests ??
  [];

setRequests(Array.isArray(apiRequests) ? apiRequests : []);
      setRequests(Array.isArray(apiRequests) ? apiRequests : []);
    } catch (e) {
      console.error('Could not load medicine requests from the API:', e);
      setRequests([]);
      setActionMessage(`Could not load requests from the server: ${e.message || 'Please check the backend and login.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    setActionMessage('');
    try {
      await requestService.updateStatus(requestId, { status });
      setActionMessage(`Request status updated to ${status}.`);
      await fetchData();
    } catch (e) {
      console.error(`Failed to update request ${requestId}:`, e);
      setActionMessage(`Could not update request: ${e.message || 'Please check your permissions and backend logs.'}`);
    }
  };

  const handleCreateRequisition = async (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-NGO-${Math.floor(1005 + Math.random() * 8999)}`,
      ngoName: user?.ngo?.name || user?.fullName || 'Helping Hands Foundation NGO',
      ngoRegNo: user?.ngo?.registrationNumber || 'NGO-TS-HYD-401',
      contactPhone: user?.phone || '+91 98490 12345',
      address: user?.ngo?.address || user?.address || 'H.No 12-2-823, Mehdipatnam X Roads, Hyderabad',
      medicineName: reqMedicineName,
      genericName: reqMedicineName,
      requiredQuantity: parseInt(reqQuantity, 10) || 50,
      priority: reqPriority,
      status: 'REQUESTED',
      reason: reqReason,
      destination: reqDestination,
      requestedAt: new Date().toISOString(),
      allocatedFrom: null,
    };

    const updatedList = addNgoRequest(newReq);
    setRequests(updatedList);

    setActionMessage(`Medicine Requisition #${newReq.id} submitted! Visible in Admin, Pharmacy, and Hospital Command Centers.`);
    setActiveTab('REQUESTS');
    setTimeout(() => setActionMessage(''), 4500);
  };

  const handleAcceptSurplusMedicine = (itemId) => {
    const updated = updateDonationStatus(itemId, {
      status: 'CLAIMED_BY_NGO',
      claimedByNgo: {
        name: user?.ngo?.name || 'Helping Hands Foundation NGO',
        regNo: user?.ngo?.registrationNumber || 'NGO-TS-HYD-401',
        phone: user?.phone || '+91 98490 12345',
        address: user?.ngo?.address || user?.address || 'H.No 12-2-823, Mehdipatnam X Roads, Hyderabad',
      },
      riderInfo: {
        riderName: 'Vikram Singh (NGO Logistics)',
        riderPhone: '+91 98490 88776',
        vehicle: 'Telangana NGO Delivery Van (TS 09 EQ 4412)',
        stage: 'DISPATCHED_RIDER',
        statusLabel: 'Rider Assigned & En Route to Donor Location',
        updatedAt: new Date().toISOString(),
      },
    });

    const verifiedSurplus = updated.filter(
      (d) => d.status === 'APPROVED_BY_ADMIN' || d.status === 'CLAIMED_BY_NGO'
    );
    setApprovedInventory(verifiedSurplus);

    setActionMessage(`Medicine donation #${itemId} claimed successfully! Rider Vikram Singh dispatched to pick up from donor.`);
    setTimeout(() => setActionMessage(''), 4500);
  };

  const handleAdvanceRiderStage = (itemId, newStage, statusLabel) => {
    const targetItem = approvedInventory.find((d) => d.id === itemId);
    if (!targetItem || !targetItem.riderInfo) return;

    const updatedRider = {
      ...targetItem.riderInfo,
      stage: newStage,
      statusLabel,
      updatedAt: new Date().toISOString(),
    };

    const updated = updateDonationStatus(itemId, {
      riderInfo: updatedRider,
    });

    const verifiedSurplus = updated.filter(
      (d) => d.status === 'APPROVED_BY_ADMIN' || d.status === 'CLAIMED_BY_NGO'
    );
    setApprovedInventory(verifiedSurplus);

    setActionMessage(`Rider Logistics status updated: ${statusLabel}`);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-emerald-100 border border-white/20 mb-1">
            <HeartHandshake className="w-3.5 h-3.5" /> Humanitarian NGO Allocation Network
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            NGO Medicine Allocation & Request Portal
          </h1>
          <p className="text-xs text-emerald-100">
            Organization: <span className="font-bold text-white">{user?.ngo?.name || 'HealthForRefugees Global NGO'}</span> • Reg: <span className="font-mono">{user?.ngo?.registrationNumber || 'NGO-TS-HYD-401'}</span>
          </p>
          {/* NGO Physical Location Display */}
          <div className="text-xs text-emerald-100 flex items-center gap-1.5 pt-1">
            <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>NGO Registered Location: <strong className="text-white font-semibold">{user?.ngo?.address || user?.address || 'H.No 12-2-823, Mehdipatnam X Roads, Hyderabad, Telangana - 500028'}</strong></span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-emerald-100 space-y-1 self-start md:self-auto shrink-0">
          <div className="font-bold text-white text-sm">Telangana Health Relief Desk</div>
          <div>Approved Surplus Inventory: <strong className="text-white">{approvedInventory.length} Items</strong></div>
          <div>Active Requests Queue: <strong className="text-white">{requests.length}</strong></div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {actionMessage}
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold pb-1">
        <button
          onClick={() => setActiveTab('SURPLUS')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'SURPLUS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" /> Approved Surplus Inventory ({approvedInventory.length})
        </button>

        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'REQUESTS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" /> Community Medicine Requests ({requests.length})
        </button>

        <button
          onClick={() => setActiveTab('NEW_REQ')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'NEW_REQ'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Plus className="w-4 h-4" /> Request Medicine (New Requisition)
        </button>
      </div>

      {/* TAB 1: APPROVED SURPLUS MEDICINES */}
      {activeTab === 'SURPLUS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> Approved Surplus Donated Medicines Inventory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Admin-approved donated medicines with extracted OCR verification details. NGOs can accept and claim these medicines for allocation to local patients and clinics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedInventory.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 text-xs"
              >
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-brand-700 font-bold">{item.id}</span>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                        ADMIN APPROVED
                      </span>
                      {item.status === 'CLAIMED_BY_NGO' && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px]">
                          CLAIMED BY NGO
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">{item.medicineName}</h4>
                    <p className="text-slate-600 font-semibold">{item.genericName}</p>
                  </div>

                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300 text-xs shrink-0">
                    {item.quantity} Units
                  </span>
                </div>

                {/* Packaging Photo Thumbnail & OCR Extracted Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {/* Uploaded Image Preview Box */}
                  <div className="bg-slate-900 rounded-xl p-2.5 flex flex-col items-center justify-center text-white text-center min-h-[110px]">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Uploaded Medicine Packaging"
                        className="max-h-24 rounded-lg object-contain bg-slate-950 p-1"
                      />
                    ) : (
                      <>
                        <Pill className="w-8 h-8 text-emerald-400 mb-1" />
                        <span className="text-[10px] font-extrabold text-emerald-200">Strip Image</span>
                        <span className="text-[9px] text-slate-400">OCR Verified</span>
                      </>
                    )}
                  </div>

                  {/* OCR Details Table */}
                  <div className="sm:col-span-2 space-y-1 text-slate-700 text-[11px] font-medium">
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">Manufacturer:</span>
                      <strong className="text-slate-900">{item.manufacturer}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">Batch Number:</span>
                      <strong className="font-mono text-slate-900">{item.batchNumber}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">MFG / EXP Dates:</span>
                      <strong className="font-mono text-emerald-700">{item.mfgDate || '01/2024'} - {item.expiryDate}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">Barcode / MRP:</span>
                      <strong className="font-mono text-slate-900">{item.barcode || '8901734009126'} (₹{item.mrp || '18.50'})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Donor Contact:</span>
                      <strong className="text-slate-900">{item.donorName} ({item.donorPhone})</strong>
                    </div>
                  </div>
                </div>

                {/* Donor Pickup Address */}
                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Donor Pickup Location: <strong className="text-slate-800">{item.donorAddress || 'Hyderabad, Telangana'}</strong></span>
                </div>

                {/* Rider Pickup & Delivery Logistics Tracker Box (If Claimed) */}
                {item.riderInfo && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 text-indigo-950">
                    <div className="flex items-center justify-between font-extrabold text-[11px]">
                      <span className="flex items-center gap-1.5 text-indigo-900">
                        🚴 Rider Logistics Tracker
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-extrabold text-[10px]">
                        {item.riderInfo.stage}
                      </span>
                    </div>

                    <div className="text-[11px] space-y-0.5">
                      <div>Assigned Rider: <strong>{item.riderInfo.riderName}</strong> ({item.riderInfo.riderPhone})</div>
                      <div>Vehicle: <span className="font-mono text-indigo-900">{item.riderInfo.vehicle}</span></div>
                      <div>Status: <strong className="text-indigo-700">{item.riderInfo.statusLabel}</strong></div>
                    </div>

                    {/* Rider Stage Action Control Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      {item.riderInfo.stage === 'DISPATCHED_RIDER' && (
                        <button
                          onClick={() =>
                            handleAdvanceRiderStage(
                              item.id,
                              'PICKED_UP_FROM_DONOR',
                              'Medicine Picked Up from Donor Location'
                            )
                          }
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
                        >
                          Confirm Picked Up from Donor
                        </button>
                      )}

                      {item.riderInfo.stage === 'PICKED_UP_FROM_DONOR' && (
                        <button
                          onClick={() =>
                            handleAdvanceRiderStage(
                              item.id,
                              'DELIVERED_TO_NGO',
                              'Medicine Delivered to NGO Hub'
                            )
                          }
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
                        >
                          Confirm Delivered to NGO Hub
                        </button>
                      )}

                      {item.riderInfo.stage === 'DELIVERED_TO_NGO' && (
                        <div className="w-full py-1.5 bg-emerald-100 text-emerald-800 font-extrabold text-center rounded-xl border border-emerald-300">
                          ✓ Delivered & Added to NGO Inventory
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Claiming Action Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold">
                    {item.claimedByNgo ? (
                      <span className="text-emerald-700 font-bold">Claimed by {item.claimedByNgo.name}</span>
                    ) : (
                      <span>Status: Available for NGO Claim</span>
                    )}
                  </div>

                  {item.status === 'CLAIMED_BY_NGO' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Claimed & Assigned
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcceptSurplusMedicine(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" /> Accept / Claim Medicine
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY REQUESTS QUEUE */}
      {activeTab === 'REQUESTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Filters & Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" /> Community Medicine Requests Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review incoming requests from healthcare clinics, schools, and individuals to approve and allocate surplus medicine inventory.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs font-semibold">
              <Filter className="w-4 h-4 text-emerald-600" />
              {['ALL', 'REQUESTED', 'APPROVED', 'ALLOCATED', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    filterStatus === st
                      ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          {loading ? (
            <div className="text-center py-12 text-xs font-bold text-slate-500">
              Loading community requests queue...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <HeartHandshake className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="font-bold text-slate-800 text-base">No Requests Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No community medicine requests currently match the selected "{filterStatus}" filter status.
              </p>
              <button
                onClick={() => setFilterStatus('ALL')}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700"
              >
                View All Requests Queue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-slate-900 text-sm">
                        Request #{req.id.slice(0, 10)}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.priority === 'URGENT' || req.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {req.priority || 'MEDIUM'} PRIORITY
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'APPROVED' || req.status === 'ALLOCATED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'COMPLETED'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="text-slate-700 font-semibold">
                      Purpose: <span className="text-slate-900">{req.reason}</span>
                    </div>

                    <div className="text-slate-600 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Requester:{' '}
                      <strong className="text-slate-800">
                        {req.requester?.profile?.fullName || req.requester?.email || 'Community Representative'}
                      </strong>
                      {req.requester?.profile?.phone && (
                        <span className="text-slate-500 ml-1">({req.requester.profile.phone})</span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="font-bold text-slate-800">Requested Medicines:</div>
                      <div className="flex flex-wrap gap-2">
                       {(Array.isArray(req.items) ? req.items : []).map((i, idx) => (
  <span
    key={i.id || idx}
    className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-800"
  >
    💊 {i.medicine?.name || i.medicineName || 'Medicine name unavailable'}
    {' '}(x{i.quantity})
  </span>
))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 self-start md:self-auto shrink-0">
                    {req.status === 'REQUESTED' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check className="w-4 h-4" /> Approve Request
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'ALLOCATED')}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Send className="w-4 h-4" /> Allocate Stock
                        </button>
                      </>
                    )}

                    {req.status === 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'ALLOCATED')}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Send className="w-4 h-4" /> Allocate & Dispatch
                      </button>
                    )}

                    {req.status === 'ALLOCATED' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'COMPLETED')}
                        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Delivered
                      </button>
                    )}

                    {req.status === 'COMPLETED' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fulfilled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CREATE MEDICINE REQUISITION FORM */}
      {activeTab === 'NEW_REQ' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
              <Plus className="w-6 h-6 text-brand-600" /> Submit New Medicine Requisition
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Submit a medicine request on behalf of an NGO, clinic, or relief drive. Requests are instantly broadcasted across Admin, Pharmacies, Hospitals, and NGOs.
            </p>
          </div>

          <form onSubmit={handleCreateRequisition} className="space-y-4 max-w-2xl text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Required Medicine / Formulation *</label>
              <select
                value={reqMedicineName}
                onChange={(e) => setReqMedicineName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
              >
                <option value="Okacet 10 (Cetirizine 10mg)">Okacet 10 (Cetirizine Hydrochloride 10mg)</option>
                <option value="Dolo 650 (Paracetamol 650mg)">Dolo 650 (Paracetamol 650mg)</option>
                <option value="Pan-40 (Pantoprazole 40mg)">Pan-40 (Pantoprazole 40mg)</option>
                <option value="Mox 500 (Amoxicillin 500mg)">Mox 500 (Amoxicillin 500mg)</option>
                <option value="Azee 500 (Azithromycin 500mg)">Azee 500 (Azithromycin 500mg)</option>
                <option value="ORS Electrolyte Packets">ORS Electrolyte Packets</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Quantity (Units) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={reqQuantity}
                  onChange={(e) => setReqQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                <select
                  value={reqPriority}
                  onChange={(e) => setReqPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-700 bg-emerald-50"
                >
                  <option value="HIGH">HIGH PRIORITY</option>
                  <option value="URGENT">URGENT</option>
                  <option value="MEDIUM">MEDIUM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Requisition Purpose / Health Drive Reason *</label>
              <input
                type="text"
                required
                value={reqReason}
                onChange={(e) => setReqReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                placeholder="e.g. Free Health & Immunity Relief Camp"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Destination Health Facility / Location *</label>
              <input
                type="text"
                required
                value={reqDestination}
                onChange={(e) => setReqDestination(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                placeholder="e.g. Community Health Center, Mehdipatnam"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" /> Broadcast Medicine Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

