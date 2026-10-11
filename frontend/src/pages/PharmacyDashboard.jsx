import React, { useState, useEffect } from 'react';
import { pharmacyService, medicineService } from '../services/api';
import { parseTabletImageOcr } from '../utils/ocrExtractor';
import {
  Building2,
  Plus,
  Package,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Sparkles,
  Edit3,
  Save,
  X,
  Phone,
  MapPin,
  Clock,
  Check,
  Search,
  HeartHandshake,
  Trash2,
} from 'lucide-react';
import { getStoredDonations, addDonation, getStoredNgoRequests, allocateNgoRequest } from '../utils/donationStore';

export const PharmacyDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form for adding inventory item
  const [selectedMedId, setSelectedMedId] = useState('');
  const [customMedName, setCustomMedName] = useState('');
  const [batchNumber, setBatchNumber] = useState('BATCH-2026-P1');
  const [expiryDate, setExpiryDate] = useState('2028-06-30');
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(120);

  // OCR Scan Modal State
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrImage, setOcrImage] = useState(null);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Editing Stock Item State
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState(0);
  const [editPrice, setEditPrice] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, medRes] = await Promise.all([
        pharmacyService.getInventory().catch(() => null),
        medicineService.search({}).catch(() => null),
      ]);

      if (invRes?.success) {
        setInventory(invRes.data.inventory || []);
        setPharmacy(invRes.data.pharmacy);
      }

      if (medRes?.success) {
        setMedicines(medRes.data.medicines || []);
        if (medRes.data.medicines?.length > 0) {
          setSelectedMedId(medRes.data.medicines[0].id);
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

  const handleAddItem = async (e) => {
    e?.preventDefault();
    const medTitle = customMedName || medicines.find((m) => m.id === selectedMedId)?.name || 'Pharmacy Surplus Stock';

    const newStockItem = {
      id: `inv-${Date.now()}`,
      medicine: { name: medTitle },
      batchNumber,
      expiryDate,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      isAvailable: true,
    };
    setInventory((prev) => [newStockItem, ...prev]);

    // Sync into shared donation store for cross-portal visibility in NGO & Admin
    const sharedItem = {
      id: `DON-PHARM-${Math.floor(2000 + Math.random() * 8999)}`,
      medicineName: medTitle,
      genericName: medTitle,
      manufacturer: pharmacy?.name || 'Apollo Pharmacy',
      batchNumber: batchNumber || 'B-2026-P1',
      mfgDate: '2024-03-01',
      expiryDate: expiryDate || '2028-06-30',
      barcode: `8901845${Math.floor(100000 + Math.random() * 899999)}`,
      mrp: parseFloat(price).toFixed(2),
      quantity: parseInt(quantity, 10),
      condition: 'Pharmacy Sealed Stock',
      donorName: pharmacy?.name || 'Partner Pharmacy (Banjara Hills)',
      donorPhone: '+91 40 2355 1122',
      donorAddress: 'Road No. 2, Banjara Hills, Hyderabad',
      imageUrl: '/uploads/med-1791540512664-667675861.jpg',
      confidenceScore: '99.5%',
      rawOcrText: `[PHARMACY STOCK] BRAND: ${medTitle} | BATCH: ${batchNumber} | EXP: ${expiryDate}`,
      status: 'APPROVED_BY_ADMIN', // Instantly available for NGO claiming
      submittedAt: new Date().toISOString(),
      sourceType: 'PHARMACY',
      rejectionReason: '',
      claimedByNgo: null,
      riderInfo: null,
    };

    addDonation(sharedItem);

    setMessage('Pharmacy stock item saved! Available in NGO & Admin portals for claiming.');
    setTimeout(() => setMessage(''), 3500);
  };

  const handleAllocateNgoReq = (reqId) => {
    const supplierInfo = {
      type: 'PHARMACY',
      name: pharmacy?.name || 'Apollo Pharmacy (Banjara Hills)',
      address: 'Road No. 2, Banjara Hills, Hyderabad',
      phone: '+91 40 2355 1122',
    };
    const updated = allocateNgoRequest(reqId, supplierInfo);
    setNgoRequests(updated);

    setMessage(`Requisition #${reqId} allocated successfully from Pharmacy Inventory!`);
    setTimeout(() => setMessage(''), 4000);
  };

  // OCR Scan Simulation Handler
  const handleOcrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrImage(URL.createObjectURL(file));
    setOcrScanning(true);

    setTimeout(() => {
      const extracted = parseTabletImageOcr(file, pharmacy?.name || 'Partner Pharmacy');
      const scannedData = {
        medicineName: extracted.medicineName,
        genericName: extracted.genericName,
        manufacturer: extracted.manufacturer,
        batchNumber: extracted.batchNumber,
        barcode: extracted.barcode,
        manufactureDate: extracted.manufactureDate,
        expiryDate: extracted.expiryDate,
        quantity: 100,
        price: parseFloat(extracted.mrp),
        confidence: extracted.confidence,
        rawOcrText: extracted.rawOcrText,
      };

      setOcrResult(scannedData);
      setOcrScanning(false);
    }, 1200);
  };

  const applyOcrDataToForm = () => {
    if (!ocrResult) return;
    setCustomMedName(ocrResult.medicineName);
    setBatchNumber(ocrResult.batchNumber);
    setExpiryDate(ocrResult.expiryDate);
    setQuantity(ocrResult.quantity);
    setPrice(ocrResult.price);
    setShowOcrModal(false);
    setMessage(`OCR Extracted Data Applied: ${ocrResult.medicineName}`);
    setTimeout(() => setMessage(''), 3500);
  };

  // Save Inline Stock Edit
  const handleSaveEdit = (invId) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === invId ? { ...item, quantity: parseInt(editQty, 10), price: parseFloat(editPrice) } : item
      )
    );
    setEditingId(null);
    setMessage('Stock quantity & unit price updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Delete Out-of-Stock or Selected Stock Item
  const handleDeleteStock = (invId) => {
    setInventory((prev) => prev.filter((item) => item.id !== invId));
    setMessage('Medicine stock item deleted successfully from pharmacy inventory!');
    setTimeout(() => setMessage(''), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20 mb-2">
            <Building2 className="w-3.5 h-3.5" /> Partner Pharmacy Operations Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {pharmacy?.name || 'MediBridge Partner Pharmacy'}
          </h1>
          <p className="text-xs text-blue-100">
            License No: <span className="font-mono font-bold text-white">{pharmacy?.licenseNumber || 'TS-HYD-PH-2026-8801'}</span> • Region: Telangana, India
          </p>
        </div>

        {/* Quick OCR Scan Button */}
        <button
          onClick={() => setShowOcrModal(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all self-start md:self-auto"
        >
          <Camera className="w-4 h-4" /> Smart OCR Medicine Scan
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* STOCK INVENTORY MANAGEMENT & EDITING */}
      <div className="space-y-8">
        {/* Add Stock Form with OCR trigger */}
        <form
          onSubmit={handleAddItem}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Add Medicine Stock to Inventory
              </h3>
              <p className="text-xs text-slate-500">
                Fill details manually or use Smart OCR Scanner to auto-fill medicine labels.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowOcrModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Auto-Fill via OCR Scan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="lg:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Medicine Name / Formulation *</label>
              {customMedName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customMedName}
                    onChange={(e) => setCustomMedName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-blue-300 bg-blue-50/50 font-bold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomMedName('')}
                    className="text-xs text-slate-400 hover:text-slate-700"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.strength})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Batch Number *</label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Price (₹) *</label>
              <input
                type="number"
                step="0.5"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-blue-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Save Stock Item
          </button>
        </form>

        {/* Inventory Editing Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" /> Current Pharmacy Inventory & Stock Editing
            </h3>
            <span className="text-xs text-slate-500 font-semibold">{inventory.length} Medicine Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3">Medicine Name</th>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Stock Quantity</th>
                  <th className="p-3">Unit Price (₹)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Edit Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((inv) => {
                  const isEditing = editingId === inv.id;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        {inv.medicine?.name || inv.name || 'Medicine Formulation'}
                      </td>
                      <td className="p-3 font-mono text-slate-600">{inv.batchNumber}</td>
                      <td className="p-3 text-slate-600">
                        {inv.expiryDate ? new Date(inv.expiryDate).toLocaleDateString('en-IN') : '2028-12-31'}
                      </td>

                      {/* Stock Quantity Column */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            className="w-20 px-2 py-1 border border-blue-400 rounded-lg font-bold text-slate-900"
                          />
                        ) : (
                          <span className="font-extrabold text-slate-900">{inv.quantity} units</span>
                        )}
                      </td>

                      {/* Unit Price Column */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.5"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 px-2 py-1 border border-blue-400 rounded-lg font-bold text-blue-700"
                          />
                        ) : (
                          <span className="font-extrabold text-blue-700">₹{inv.price?.toFixed(2)}</span>
                        )}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {inv.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Action Column */}
                      <td className="p-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(inv.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700"
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingId(inv.id);
                                setEditQty(inv.quantity);
                                setEditPrice(inv.price);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 font-bold text-xs flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStock(inv.id)}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-400 font-bold text-xs flex items-center gap-1"
                              title="Delete medicine stock"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* LIVE NGO COMMUNITY MEDICINE REQUISITIONS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" /> Active NGO Medicine Requisitions (Community Demands)
              </h3>
              <p className="text-xs text-slate-500">
                View requested medicines submitted by NGOs across Hyderabad. Allocate available stock to fulfill relief needs.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs self-start sm:self-auto">
              {ngoRequests.filter((r) => r.status === 'REQUESTED').length} Unfulfilled Demands
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {ngoRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
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

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 space-y-1">
                  <div>
                    Requesting NGO: <strong className="text-slate-900">{req.ngoName}</strong>
                  </div>
                  <div>Phone: <span className="font-mono font-bold">{req.contactPhone}</span></div>
                  <div className="flex items-start gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{req.address}</span>
                  </div>
                </div>

                {req.status === 'ALLOCATED' && req.allocatedFrom ? (
                  <div className="p-2 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-[11px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    Allocated from {req.allocatedFrom.name} ({req.allocatedFrom.type})
                  </div>
                ) : (
                  <button
                    onClick={() => handleAllocateNgoReq(req.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" /> Allocate & Fulfill from Pharmacy Inventory
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OCR SCAN MODAL */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">Smart OCR Prescription / Label Scanner</h3>
              </div>
              <button
                onClick={() => setShowOcrModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upload an image of a medicine bottle, box label, or doctor's prescription. MediBridge OCR will automatically parse the medicine name, batch number, expiry date, and unit price.
            </p>

            {/* Dropzone Upload */}
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 p-6 rounded-2xl text-center space-y-3 relative cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleOcrUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 mx-auto text-emerald-600" />
              <div className="text-xs font-bold text-slate-800">
                Click to upload or drag & drop medicine image
              </div>
              <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP prescription photos</p>
            </div>

            {ocrScanning && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-bold text-emerald-900 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" /> Scanning image & extracting text...
              </div>
            )}

            {ocrResult && (
              <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-extrabold text-emerald-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> OCR Parsed Successfully
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    {ocrResult.confidence}% Accuracy
                  </span>
                </div>

                <div className="space-y-1 text-slate-700 pt-1">
                  <div>
                    Medicine Name: <strong className="text-slate-900">{ocrResult.medicineName}</strong>
                  </div>
                  <div>
                    Batch: <span className="font-mono text-slate-800">{ocrResult.batchNumber}</span>
                  </div>
                  <div>
                    Expiry: <span className="text-slate-800">{ocrResult.expiryDate}</span>
                  </div>
                  <div>
                    Price: <strong className="text-emerald-700">₹{ocrResult.price.toFixed(2)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyOcrDataToForm}
                  className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" /> Apply Extracted Data to Form
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

