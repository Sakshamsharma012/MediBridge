import React, { useState, useEffect } from 'react';
import { requestService, donationService, orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Package, ShoppingBag, Clock, CheckCircle2, AlertCircle, Pill, ShieldCheck, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { getStoredDonations } from '../utils/donationStore';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('DONATIONS'); // Default to 'DONATIONS' for donor workspace
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Load shared donations from donationStore
      const sharedDons = getStoredDonations();
      setDonations(sharedDons);

      const [reqRes, ordRes] = await Promise.all([
        requestService.getMyRequests().catch(() => null),
        orderService.getMyOrders().catch(() => null),
      ]);
      if (reqRes?.success) setRequests(reqRes.data.requests || []);
      if (ordRes?.success) setOrders(ordRes.data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-2 shadow-xl border border-brand-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-brand-100 border border-white/20 mb-1">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" /> User Portal
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">My MediBridge Dashboard</h1>
        <p className="text-xs text-brand-100">
          Account: <span className="font-bold text-white">{user?.fullName || user?.email || 'Donor User'}</span> • Phone: <span className="font-mono">{user?.phone || '+91 98490 12345'}</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 text-xs font-bold pb-1">
        <button
          onClick={() => setTab('DONATIONS')}
          className={`py-2.5 px-4 rounded-2xl transition-all flex items-center gap-2 ${
            tab === 'DONATIONS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" /> My Medicine Donations ({donations.length})
        </button>

        <button
          onClick={() => setTab('REQUESTS')}
          className={`py-2.5 px-4 rounded-2xl transition-all flex items-center gap-2 ${
            tab === 'REQUESTS'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" /> My Medicine Requests ({requests.length})
        </button>

        <button
          onClick={() => setTab('ORDERS')}
          className={`py-2.5 px-4 rounded-2xl transition-all flex items-center gap-2 ${
            tab === 'ORDERS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Pharmacy Orders ({orders.length})
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500 font-semibold">Loading records...</div>
      ) : tab === 'DONATIONS' ? (
        <div className="space-y-6">
          {donations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500 font-bold space-y-2">
              <HeartHandshake className="w-10 h-10 mx-auto text-slate-400" />
              <div>No medicine donations submitted yet.</div>
            </div>
          ) : (
            donations.map((don) => (
              <div key={don.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 text-xs">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-brand-700 text-xs">{don.id}</span>
                      <span className="text-[11px] text-slate-400">
                        Submitted: {new Date(don.submittedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base">{don.medicineName}</h3>
                    <p className="text-slate-600 font-semibold">{don.genericName}</p>
                  </div>

                  {/* Status Badges */}
                  <div className="self-start sm:self-auto">
                    {don.status === 'PENDING_ADMIN_REVIEW' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending Admin OCR Verification
                      </span>
                    )}

                    {don.status === 'APPROVED_BY_ADMIN' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved by Admin - Available in NGO Portal
                      </span>
                    )}

                    {don.status === 'CLAIMED_BY_NGO' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Claimed by {don.claimedByNgo?.name || 'NGO'}
                      </span>
                    )}

                    {don.status === 'REJECTED' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Rejected by Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Packaging Photo Thumbnail & OCR Extracted Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {/* Uploaded Image Preview Box */}
                  <div className="bg-slate-900 rounded-xl p-2.5 flex flex-col items-center justify-center text-white text-center min-h-[110px]">
                    {don.imageUrl ? (
                      <img
                        src={don.imageUrl}
                        alt="Uploaded Medicine Packaging"
                        className="max-h-24 rounded-lg object-contain bg-slate-950 p-1"
                      />
                    ) : (
                      <>
                        <Pill className="w-8 h-8 text-emerald-400 mb-1" />
                        <span className="text-[10px] font-extrabold text-emerald-200">Packaging Strip</span>
                      </>
                    )}
                  </div>

                  {/* OCR Details Table */}
                  <div className="sm:col-span-2 space-y-1 text-slate-700 text-[11px] font-medium">
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">Manufacturer:</span>
                      <strong className="text-slate-900">{don.manufacturer}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">Batch Number:</span>
                      <strong className="font-mono text-slate-900">{don.batchNumber}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">MFG / EXP Dates:</span>
                      <strong className="font-mono text-emerald-700">MFG: {don.mfgDate || '01/2024'} | EXP: {don.expiryDate}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-500">Scanned Barcode:</span>
                      <strong className="font-mono text-slate-900">{don.barcode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Donated Quantity:</span>
                      <strong className="font-extrabold text-slate-900">{don.quantity} Units</strong>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason Notice (If Rejected) */}
                {don.status === 'REJECTED' && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                    <div className="font-extrabold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Admin Rejection Notice
                    </div>
                    <p className="text-[11px] font-medium text-rose-800">
                      {don.rejectionReason || 'REJECTED BY ADMIN: Packaging seal broken or passed safety expiry date.'}
                    </p>
                  </div>
                )}

                {/* Claimed NGO & Rider Pickup Logistics Progress Bar (If Claimed) */}
                {don.status === 'CLAIMED_BY_NGO' && don.riderInfo && (
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3 text-indigo-950">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-indigo-200/80 pb-2">
                      <div className="font-extrabold text-xs flex items-center gap-1.5 text-indigo-900">
                        <Truck className="w-4 h-4 text-indigo-600" /> NGO Rider Pickup & Delivery Progress
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700">
                        Accepted by: {don.claimedByNgo?.name} ({don.claimedByNgo?.phone})
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>Assigned Rider: <strong>{don.riderInfo.riderName}</strong> ({don.riderInfo.riderPhone})</div>
                      <div>Vehicle: <span className="font-mono text-indigo-900">{don.riderInfo.vehicle}</span></div>
                    </div>

                    {/* Step-by-Step Logistics Tracker */}
                    <div className="pt-2 border-t border-indigo-200/60 grid grid-cols-3 gap-2 text-[10px] font-extrabold text-center">
                      <div className={`p-2 rounded-xl border ${
                        don.riderInfo.stage === 'DISPATCHED_RIDER' || don.riderInfo.stage === 'PICKED_UP_FROM_DONOR' || don.riderInfo.stage === 'DELIVERED_TO_NGO'
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        1. Rider Assigned
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        don.riderInfo.stage === 'PICKED_UP_FROM_DONOR' || don.riderInfo.stage === 'DELIVERED_TO_NGO'
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        2. Picked Up from Donor
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        don.riderInfo.stage === 'DELIVERED_TO_NGO'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        3. Delivered to NGO Hub
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : tab === 'REQUESTS' ? (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border text-xs text-slate-500 font-bold">No requests submitted yet.</div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Request #{req.id.slice(0, 8)}</div>
                  <div className="text-slate-600 font-medium">
                    Items: {req.items.map((i) => `${i.medicine?.name || 'Medicine'} (x${i.quantity})`).join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-400">Created: {new Date(req.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border text-xs text-slate-500 font-bold">No pharmacy orders placed yet.</div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Order #{ord.id?.slice(0, 8)}</div>
                  <div className="text-slate-600">Pharmacy: {ord.pharmacy?.name}</div>
                  <div className="text-[11px] text-slate-400">Status: {ord.status} | Payment: {ord.paymentStatus}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {ord.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

