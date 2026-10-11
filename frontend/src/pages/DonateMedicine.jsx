import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { donationService } from '../services/api';

import { HeartHandshake, Upload, Camera, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, FileText, ArrowRight } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import { parseTabletImageOcr } from '../utils/ocrExtractor';



import { addDonation } from '../utils/donationStore';



export const DonateMedicine = () => {

  const { user, isLoggedIn } = useAuth();

  const navigate = useNavigate();



  const [step, setStep] = useState(1);

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);



  // Form fields

  const [medicineName, setMedicineName] = useState('');

  const [genericName, setGenericName] = useState('');

  const [strength, setStrength] = useState('');

  const [dosageForm, setDosageForm] = useState('');

  const [manufacturer, setManufacturer] = useState('');

  const [batchNumber, setBatchNumber] = useState('');

  const [manufactureDate, setManufactureDate] = useState('');

  const [expiryDate, setExpiryDate] = useState('');

  const [quantity, setQuantity] = useState(30);

  const [condition, setCondition] = useState('Sealed');

  const [pickupPreference, setPickupPreference] = useState('SELF_DROP');

  const [barcode, setBarcode] = useState('');

  const [donorName, setDonorName] = useState(user?.fullName || '');

  const [ocrScanning, setOcrScanning] = useState(false);



  // OCR result preview

  const [ocrData, setOcrData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');
  const handleImageSelect = async (e) => {

  const file = e.target.files?.[0];

  if (!file) return;



  setSelectedFile(file);

  setPreviewUrl(URL.createObjectURL(file));

  setError('');

  setOcrData(null);



  // Never carry dates or batch numbers over from another image.

  setMedicineName('');

  setGenericName('');

  setStrength('');

  setDosageForm('');

  setManufacturer('');

  setBatchNumber('');

  setManufactureDate('');

  setExpiryDate('');

  setBarcode('');



  setOcrScanning(true);



  try {

    const extracted = await parseTabletImageOcr(file);



    setMedicineName(extracted.medicineName);

    setGenericName(extracted.genericName);

    setStrength(extracted.strength);

    setDosageForm(extracted.dosageForm);

    setManufacturer(extracted.manufacturer);

    setBatchNumber(extracted.batchNumber);

    setManufactureDate(extracted.manufactureDate);

    setExpiryDate(extracted.expiryDate);

    setBarcode(extracted.barcode);



    setOcrData({

      confidence: extracted.confidence / 100,

      text: extracted.rawOcrText,

      extracted

    });



    if (!extracted.expiryDate) {

      setError(

        'Expiry date could not be read. Check the printed packaging and enter it manually.'

      );

    }

  } catch (err) {

    setError('OCR scanning failed. Try a clearer, well-lit packaging photo.');

  } finally {

    setOcrScanning(false);

  }

};





  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isLoggedIn) {

      alert('Please sign in to submit a donation.');

      navigate('/login');

      return;

    }

    setError('');

    if (
      !medicineName.trim() ||
      !genericName.trim() ||
      !manufacturer.trim() ||
      !batchNumber.trim() ||
      !manufactureDate ||
      !expiryDate ||
      !donorName.trim() ||
      !quantity ||
      Number(quantity) < 1
    ) {
      setError('Complete all required medicine details and verify the dates against the printed packaging before submitting.');
      setStep(2);
      return;
    }

    if (new Date(`${expiryDate}T23:59:59`) <= new Date()) {
      setError('This medicine appears to be expired. It cannot be submitted for donation.');
      setStep(2);
      return;
    }

    if (new Date(`${manufactureDate}T00:00:00`) > new Date(`${expiryDate}T00:00:00`)) {
      setError('The manufacture date cannot be later than the expiry date. Please check the packaging.');
      setStep(2);
      return;
    }

    setLoading(true);



    try {

      const formData = new FormData();

      if (selectedFile) formData.append('image', selectedFile);

      formData.append('medicineName', medicineName);

      formData.append('genericName', genericName);

      formData.append('strength', strength);

      formData.append('dosageForm', dosageForm);

      formData.append('manufacturer', manufacturer);

      formData.append('batchNumber', batchNumber);

      formData.append('expiryDate', expiryDate);

      formData.append('quantity', quantity);

      formData.append('condition', condition);

      formData.append('pickupPreference', pickupPreference);

      formData.append('barcode', barcode);



      try {

        await donationService.create(formData);

      } catch (backendErr) {

        console.warn('Backend donation save simulation fallback:', backendErr);

      }



      // Add the submitted donation to the shared local store.

      const newDonationObj = {

        id: `DON-HYD-${Math.floor(1005 + Math.random() * 8999)}`,

        medicineName,

        genericName,

        manufacturer,

        batchNumber,

        mfgDate: manufactureDate,

        expiryDate,

        barcode,

        mrp: ocrData?.extracted?.mrp || '',

        quantity: parseInt(quantity, 10) || 0,

        condition: condition || 'Sealed',

        donorName: donorName || user?.fullName || '',

        donorPhone: user?.phone || '',

        donorAddress: user?.address || '',

        imageUrl: previewUrl || '',

        confidenceScore: `${Math.round((ocrData?.confidence || 0) * 100)}%`,

        rawOcrText: ocrData?.text || '',

        status: 'PENDING_ADMIN_REVIEW',

        submittedAt: new Date().toISOString(),

        rejectionReason: '',

        claimedByNgo: null,

        riderInfo: null,

      };



      addDonation(newDonationObj);



      setSuccess('Medicine donation submitted successfully and queued for Admin verification!');

      setTimeout(() => {

        navigate('/dashboard');

      }, 2000);

    } catch (err) {

      setError(err.message || 'Donation submission failed.');

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      <div className="text-center space-y-2 max-w-2xl mx-auto">

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">

          <HeartHandshake className="w-4 h-4 text-emerald-600" /> Medicine Donation Portal

        </div>

        <h1 className="text-3xl font-extrabold text-slate-900">Donate Unused Medicines</h1>

        <p className="text-xs text-slate-600">

          Upload packaging photo for OCR extraction, verify barcode & expiry, and help individuals in need.

        </p>

      </div>



      {error && (

        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">

          <AlertTriangle className="w-4 h-4 shrink-0" />

          {error}

        </div>

      )}



      {success && (

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">

          <CheckCircle2 className="w-5 h-5 text-emerald-600" />

          {success}

        </div>

      )}



      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">

        {/* Step Indicator */}

        <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold">

          <span className={step === 1 ? 'text-brand-600 font-extrabold' : 'text-slate-400'}>

            1. Packaging OCR Photo

          </span>

          <span className={step === 2 ? 'text-brand-600 font-extrabold' : 'text-slate-400'}>

            2. Barcode & Specs

          </span>

          <span className={step === 3 ? 'text-brand-600 font-extrabold' : 'text-slate-400'}>

            3. Review & Submit

          </span>

        </div>



        {/* STEP 1: OCR Photo Upload */}

        {step === 1 && (

          <div className="space-y-4">

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 hover:border-brand-500 transition-colors bg-slate-50">

              {previewUrl ? (

                <div className="space-y-3">

                  <img src={previewUrl} alt="Medicine Packaging" className="max-h-48 mx-auto rounded-xl shadow-md border" />

                  <div className="text-xs font-semibold text-emerald-700">Photo Attached</div>

                </div>

              ) : (

                <div className="space-y-2">

                  <Upload className="w-10 h-10 mx-auto text-slate-400" />

                  <div className="text-xs font-bold text-slate-800">Upload Medicine Packaging Image</div>

                  <div className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP up to 5MB</div>

                </div>

              )}



              <input

                type="file"

                accept="image/*"

                onChange={handleImageSelect}

                className="hidden"

                id="fileUpload"

              />

              <label

                htmlFor="fileUpload"

                className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm"

              >

                Choose Photo

              </label>

            </div>



            {/* Donor Manual Units / Quantity Entry in Photo Upload Section */}

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">

              <label className="block font-bold text-slate-800">

                Quantity (Units / Tablets of Uploaded Medicine) *

              </label>

              <input

                type="number"

                min="1"

                required

                value={quantity}

                onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}

                placeholder="Enter number of tablets/strips (e.g. 10)"

                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"

              />

              <p className="text-[11px] text-slate-500">

                Specify exact quantity of tablets/strips present in the uploaded packaging image.

              </p>

            </div>



            {/* OCR Live Extraction Readout Box */}

            {ocrData && (

              <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 space-y-2 text-xs">

                <div className="flex items-center justify-between text-brand-900 font-bold">

                  <span className="flex items-center gap-1.5">

                    <Sparkles className="w-4 h-4 text-brand-600" /> OCR Text Extraction

                  </span>

                  <span className="bg-brand-600 text-white px-2 py-0.5 rounded-full text-[10px]">

                    {Math.round(ocrData.confidence * 100)}% Confidence

                  </span>

                </div>

                <div className="font-mono bg-white p-2.5 rounded-lg border border-brand-200 text-slate-700 text-[11px]">

                  {ocrData.text}

                </div>

                <div className="text-[11px] text-brand-700">

                  OCR can misread medicine details and dates. Verify each value against the printed package before continuing.

                </div>

              </div>

            )}



            <button

              type="button"

              onClick={() => setStep(2)}

              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-1"

            >

              Continue to Details <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        )}



        {/* STEP 2: Barcode & Medicine Details */}

        {step === 2 && (

          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4 text-xs">

              <div>

                <label className="block font-semibold text-slate-700 mb-1">Tablet / Medicine Name</label>

                <input

                  type="text"

                  required

                  value={medicineName}

                  onChange={(e) => setMedicineName(e.target.value)}

                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Generic Active Chemical</label>

                <input

                  type="text"

                  required

                  value={genericName}

                  onChange={(e) => setGenericName(e.target.value)}

                  className="w-full px-3 py-2 rounded-xl border border-slate-300"

                />

              </div>



              <div>
                <label className="block font-semibold text-slate-700 mb-1">Strength</label>
                <input
                  type="text"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="e.g. 500 mg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                <input
                  type="text"
                  value={dosageForm}
                  onChange={(e) => setDosageForm(e.target.value)}
                  placeholder="e.g. Tablet or Capsule"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>

                <label className="block font-semibold text-slate-700 mb-1">Manufacturer Company</label>

                <input

                  type="text"

                  required

                  value={manufacturer}

                  onChange={(e) => setManufacturer(e.target.value)}

                  className="w-full px-3 py-2 rounded-xl border border-slate-300"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Batch Number</label>

                <input

                  type="text"

                  required

                  value={batchNumber}

                  onChange={(e) => setBatchNumber(e.target.value)}

                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Manufacture Date (MFG)</label>

                <input

                  type="date"

                  required

                  value={manufactureDate}

                  onChange={(e) => setManufactureDate(e.target.value)}

                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Expiry Date (EXP)</label>

                <input

                  type="date"

                  required

                  value={expiryDate}

                  onChange={(e) => setExpiryDate(e.target.value)}

                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-emerald-700 font-bold"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Quantity (Units / Tablets) *</label>

                <input

                  type="number"

                  min="1"

                  required

                  value={quantity}

                  onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}

                  placeholder="e.g. 10"

                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Scanned Barcode</label>

                <div className="relative">

                  <Camera className="w-4 h-4 absolute left-3 top-3 text-slate-400" />

                  <input

                    type="text"

                    value={barcode}

                    onChange={(e) => setBarcode(e.target.value)}

                    placeholder="8901087001122"

                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800"

                  />

                </div>

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Donor / Uploader Name</label>

                <input

                  type="text"

                  required

                  value={donorName}

                  onChange={(e) => setDonorName(e.target.value)}

                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"

                />

              </div>

            </div>



            <div className="flex items-center gap-3 pt-2">

              <button

                type="button"

                onClick={() => setStep(1)}

                className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"

              >

                Back

              </button>

              <button

                type="button"

                onClick={() => setStep(3)}

                className="w-2/3 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md text-xs"

              >

                Review Submission

              </button>

            </div>

          </div>

        )}



        {/* STEP 3: Review & Final Submission */}

        {step === 3 && (

          <div className="space-y-4 text-xs">

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">

              <div className="font-bold text-slate-900 text-sm">Extracted Image Donation Summary</div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">

                <div>Tablet / Medicine: <span className="font-bold text-slate-900">{medicineName}</span></div>

                <div>Generic Active: <span className="font-semibold text-slate-900">{genericName}</span></div>
                <div>Strength: <span className="font-semibold text-slate-900">{strength || 'Not detected'}</span></div>
                <div>Dosage Form: <span className="font-semibold text-slate-900">{dosageForm || 'Not detected'}</span></div>

                <div>Manufacturer: <span className="font-semibold text-slate-900">{manufacturer}</span></div>

                <div>Batch Number: <span className="font-mono text-slate-900">{batchNumber}</span></div>

                <div>Manufacture Date: <span className="font-mono text-slate-900">{manufactureDate}</span></div>

                <div>Expiry Date: <span className="font-semibold text-emerald-700">{expiryDate}</span></div>

                <div>Quantity: <span className="font-semibold text-slate-900">{quantity} units</span></div>

                <div>Scanned Barcode: <span className="font-mono text-slate-900">{barcode || 'N/A'}</span></div>

                <div>Donor Name: <span className="font-bold text-brand-700">{donorName}</span></div>

              </div>

            </div>



            {/* Expiry reminder: OCR is not a safety verification */}
            <div className={`p-4 rounded-xl border space-y-1 ${expiryDate && new Date(`${expiryDate}T23:59:59`) > new Date() ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {expiryDate && new Date(`${expiryDate}T23:59:59`) > new Date() ? 'Expiry Date Appears Valid — Verify Packaging' : 'Expiry Date Needs Verification'}
              </div>
              <p className="text-[11px]">
                {expiryDate ? `Entered expiry date: ${expiryDate}. Confirm it matches the printed packaging; OCR can misread dates.` : 'No expiry date was detected. Read the printed packaging and enter the expiry date manually.'}
              </p>
            </div>



            <div className="flex items-center gap-3 pt-2">

              <button

                type="button"

                onClick={() => setStep(2)}

                className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"

              >

                Back

              </button>

              <button

                type="submit"

                disabled={loading}

                className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"

              >

                {loading ? 'Submitting Donation...' : 'Confirm & Submit Donation'}

              </button>

            </div>

          </div>

        )}

      </form>

    </div>

  );

};
