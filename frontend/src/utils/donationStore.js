// Shared Multi-Entity Platform Store
// Synchronizes real-time persistent data for Donors, NGOs, Pharmacies, Hospitals, and Admin Operations

const DONATIONS_KEY = 'medibridge_shared_donations_v2';
const NGO_REQUESTS_KEY = 'medibridge_ngo_requests_v1';
const PHARMACY_INVENTORY_KEY = 'medibridge_pharmacy_inventory_v1';
const ENTITIES_KEY = 'medibridge_registered_entities_v1';

// Initial Sample Donor Donations
const INITIAL_DONATIONS = [
  {
    id: 'DON-HYD-1001',
    medicineName: 'Okacet 10 (Cetirizine Hydrochloride 10mg)',
    genericName: 'Cetirizine Hydrochloride',
    manufacturer: 'Cipla Ltd',
    batchNumber: 'C126079',
    mfgDate: '2024-01-15',
    expiryDate: '2027-12-31',
    barcode: '8901734009126',
    mrp: '18.50',
    quantity: 20,
    condition: 'Sealed',
    donorName: 'Rahul Sharma',
    donorPhone: '+91 98490 12345',
    donorAddress: 'H.No 14, Road No. 12, Banjara Hills, Hyderabad',
    imageUrl: '/uploads/med-1791542837142_2e1534ff.png',
    confidenceScore: '99.2%',
    rawOcrText: '[OCR READOUT] BRAND: OKACET 10 | ACTIVE: CETIRIZINE HYDROCHLORIDE (10MG) | MFG: CIPLA LTD | B.NO: C126079 | MFG: 01/2024 | EXP: 12/2027 | BARCODE: 8901734009126 | MRP: RS 18.50',
    status: 'PENDING_ADMIN_REVIEW', // 'PENDING_ADMIN_REVIEW' | 'APPROVED_BY_ADMIN' | 'REJECTED' | 'CLAIMED_BY_NGO'
    submittedAt: new Date().toISOString(),
    sourceType: 'DONOR',
    rejectionReason: '',
    claimedByNgo: null,
    riderInfo: null,
  },
  {
    id: 'DON-HYD-1002',
    medicineName: 'Dolo 650 (Paracetamol 650mg)',
    genericName: 'Paracetamol',
    manufacturer: 'Micro Labs Limited',
    batchNumber: 'B-2026-14001',
    mfgDate: '2024-01-15',
    expiryDate: '2027-12-31',
    barcode: '8901148002536',
    mrp: '32.50',
    quantity: 50,
    condition: 'Sealed',
    donorName: 'Anitha Reddy',
    donorPhone: '+91 97011 22334',
    donorAddress: 'Flat 302, Green Glen Apartments, Jubilee Hills, Hyderabad',
    imageUrl: '/uploads/med-1791540512664-667675861.jpg',
    confidenceScore: '98.8%',
    rawOcrText: '[OCR READOUT] BRAND: DOLO 650 | ACTIVE: PARACETAMOL (650MG) | MFG: MICRO LABS | B.NO: B-2026-14001 | MFG: 01/2024 | EXP: 12/2027 | BARCODE: 8901148002536 | MRP: RS 32.50',
    status: 'APPROVED_BY_ADMIN',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    sourceType: 'DONOR',
    rejectionReason: '',
    claimedByNgo: null,
    riderInfo: null,
  },
  {
    id: 'DON-HYD-1003',
    medicineName: 'Pan-40 (Pantoprazole 40mg)',
    genericName: 'Pantoprazole Sodium',
    manufacturer: 'Sun Pharmaceutical Industries Ltd',
    batchNumber: 'PN-994201',
    mfgDate: '2024-03-10',
    expiryDate: '2028-02-28',
    barcode: '8901087001441',
    mrp: '155.00',
    quantity: 30,
    condition: 'Sealed',
    donorName: 'Suresh Kumar',
    donorPhone: '+91 99123 45678',
    donorAddress: 'H.No 8-2-120, Mehdipatnam, Hyderabad',
    imageUrl: '/uploads/med-1791540700977-208700502.jpg',
    confidenceScore: '97.5%',
    rawOcrText: '[OCR READOUT] BRAND: PAN-40 | ACTIVE: PANTOPRAZOLE (40MG) | MFG: SUN PHARMA | B.NO: PN-994201 | MFG: 03/2024 | EXP: 02/2028 | BARCODE: 8901087001441 | MRP: RS 155.00',
    status: 'CLAIMED_BY_NGO',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    sourceType: 'DONOR',
    rejectionReason: '',
    claimedByNgo: {
      name: 'Helping Hands Foundation NGO',
      regNo: 'NGO-TS-HYD-401',
      phone: '+91 98490 12345',
      address: 'H.No 12-2-823, Mehdipatnam X Roads, Hyderabad',
    },
    riderInfo: {
      riderName: 'Vikram Singh (NGO Logistics)',
      riderPhone: '+91 98490 88776',
      vehicle: 'Telangana NGO Delivery Van (TS 09 EQ 4412)',
      stage: 'PICKED_UP_FROM_DONOR',
      statusLabel: 'Medicine Picked Up from Donor Location',
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'DON-PHARM-2001',
    medicineName: 'Augmentin 625 Duo (Amoxicillin + Clavulanate)',
    genericName: 'Amoxicillin 500mg + Potassium Clavulanate 125mg',
    manufacturer: 'GlaxoSmithKline (GSK)',
    batchNumber: 'AUG-62901',
    mfgDate: '2024-03-01',
    expiryDate: '2027-04-30',
    barcode: '8901845010112',
    mrp: '215.00',
    quantity: 60,
    condition: 'Sealed Box',
    donorName: 'Apollo Pharmacy (Banjara Hills)',
    donorPhone: '+91 40 2355 1122',
    donorAddress: 'Road No. 2, Banjara Hills, Hyderabad - 500034',
    imageUrl: '/uploads/med-1791540512664-667675861.jpg',
    confidenceScore: '99.5%',
    rawOcrText: '[OCR READOUT] BRAND: AUGMENTIN 625 DUO | BATCH: AUG-62901 | EXP: 04/2027 | PHARMACY SURPLUS STOCK',
    status: 'APPROVED_BY_ADMIN',
    submittedAt: new Date(Date.now() - 43200000).toISOString(),
    sourceType: 'PHARMACY',
    rejectionReason: '',
    claimedByNgo: null,
    riderInfo: null,
  }
];

// Initial Sample NGO Medicine Requisitions
const INITIAL_NGO_REQUESTS = [
  {
    id: 'REQ-NGO-1001',
    ngoName: 'Helping Hands Foundation NGO',
    ngoRegNo: 'NGO-TS-HYD-401',
    contactPhone: '+91 98490 12345',
    address: 'H.No 12-2-823, Mehdipatnam X Roads, Hyderabad',
    medicineName: 'Okacet 10 (Cetirizine 10mg)',
    genericName: 'Cetirizine Hydrochloride',
    requiredQuantity: 50,
    priority: 'HIGH',
    status: 'REQUESTED', // 'REQUESTED' | 'ALLOCATED' | 'FULFILLED'
    reason: 'Emergency Relief Supply for Community Health Center',
    destination: 'Telangana Community Rural Health Clinic',
    requestedAt: new Date().toISOString(),
    allocatedFrom: null,
  },
  {
    id: 'REQ-NGO-1002',
    ngoName: 'Aarogya Health & Relief Foundation',
    ngoRegNo: 'NGO-TS-HYD-812',
    contactPhone: '+91 97011 22334',
    address: 'Survey No. 42, Uppal Main Road, Hyderabad',
    medicineName: 'Dolo 650 (Paracetamol 650mg)',
    genericName: 'Paracetamol',
    requiredQuantity: 100,
    priority: 'URGENT',
    status: 'ALLOCATED',
    reason: 'Free Viral Fever & Monsoon Health Camp Relief',
    destination: 'Uppal Public Relief Shelter',
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    allocatedFrom: {
      type: 'PHARMACY',
      name: 'MedPlus Pharmacy (Mehdipatnam X Roads)',
      address: 'Mehdipatnam X Roads, Hyderabad',
      phone: '+91 40 2351 9900',
    },
  },
  {
    id: 'REQ-NGO-1003',
    ngoName: 'Health For Refugees & Elderly Care Trust',
    ngoRegNo: 'NGO-TS-HYD-115',
    contactPhone: '+91 99123 45678',
    address: 'Ghatkesar Highway Route, Medchal-Malkajgiri',
    medicineName: 'Metformin HCl 500mg',
    genericName: 'Metformin',
    requiredQuantity: 120,
    priority: 'HIGH',
    status: 'REQUESTED',
    reason: 'Senior Citizen Chronic Diabetic Care Camp Support',
    destination: 'Ghatkesar Elderly Care Shelter',
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    allocatedFrom: null,
  },
];

// Registered Network Entities Directory (NGOs, Pharmacies, Hospitals)
const INITIAL_ENTITIES = {
  ngos: [
    {
      id: 'ngo-101',
      name: 'Helping Hands Foundation NGO',
      regNo: 'NGO-TS-HYD-401',
      type: 'NGO',
      phone: '+91 98490 12345',
      email: 'contact@helpinghands.org',
      address: 'H.No 12-2-823, Mehdipatnam X Roads, Hyderabad',
      zone: 'Mehdipatnam / Asif Nagar',
      status: 'VERIFIED_ACTIVE',
      demandsCount: 4,
      deliveryHub: 'Central Mehdipatnam Hub',
    },
    {
      id: 'ngo-102',
      name: 'Aarogya Health & Relief Foundation',
      regNo: 'NGO-TS-HYD-812',
      type: 'NGO',
      phone: '+91 97011 22334',
      email: 'relief@aarogyafoundation.org',
      address: 'Survey No. 42, Uppal Main Road, Hyderabad',
      zone: 'Uppal / Medipally',
      status: 'VERIFIED_ACTIVE',
      demandsCount: 2,
      deliveryHub: 'East Hyderabad Relief Hub',
    },
    {
      id: 'ngo-103',
      name: 'Health For Refugees & Elderly Care Trust',
      regNo: 'NGO-TS-HYD-115',
      type: 'NGO',
      phone: '+91 99123 45678',
      email: 'care@refugeehealth.org',
      address: 'Ghatkesar Highway Route, Medchal-Malkajgiri',
      zone: 'Ghatkesar / Narapally',
      status: 'VERIFIED_ACTIVE',
      demandsCount: 3,
      deliveryHub: 'Ghatkesar Outskirt Hub',
    },
    {
      id: 'ngo-104',
      name: 'Telangana Rural Care Trust',
      regNo: 'NGO-TS-HYD-990',
      type: 'NGO',
      phone: '+91 91234 56789',
      email: 'info@ruralcare.org',
      address: 'Medipally X Roads, Hyderabad ORR Highway',
      zone: 'Medipally / Peerzadiguda',
      status: 'VERIFIED_ACTIVE',
      demandsCount: 1,
      deliveryHub: 'Peerzadiguda Community Center',
    },
  ],
  pharmacies: [
    {
      id: 'pharm-201',
      name: 'Apollo Pharmacy (Banjara Hills)',
      licenseNo: 'TS-HYD-PH-2026-101',
      type: 'PHARMACY',
      phone: '+91 40 2355 1122',
      email: 'banjarahills@apollopharmacy.org',
      address: 'Road No. 2, Banjara Hills, Hyderabad - 500034',
      zone: 'Banjara Hills',
      status: 'VERIFIED_ACTIVE',
      surplusStockCount: 15,
    },
    {
      id: 'pharm-202',
      name: 'MedPlus Pharmacy (Mehdipatnam X Roads)',
      licenseNo: 'TS-HYD-PH-2026-204',
      type: 'PHARMACY',
      phone: '+91 40 2351 9900',
      email: 'mehdipatnam@medplusindia.com',
      address: 'H.No 12-2-790, Mehdipatnam X Roads, Hyderabad',
      zone: 'Mehdipatnam',
      status: 'VERIFIED_ACTIVE',
      surplusStockCount: 22,
    },
    {
      id: 'pharm-203',
      name: 'Telangana Jan Aushadhi Kendra (Uppal)',
      licenseNo: 'TS-HYD-PH-2026-309',
      type: 'PHARMACY',
      phone: '+91 40 2720 4455',
      email: 'uppal@janaushadhi.gov.in',
      address: 'Uppal Bus Depot Road, Peerzadiguda, Hyderabad',
      zone: 'Uppal',
      status: 'VERIFIED_ACTIVE',
      surplusStockCount: 35,
    },
    {
      id: 'pharm-204',
      name: 'Frank Ross Pharmacy (Ghatkesar Route)',
      licenseNo: 'TS-HYD-PH-2026-412',
      type: 'PHARMACY',
      phone: '+91 40 2889 7788',
      email: 'ghatkesar@frankross.in',
      address: 'Warangal Highway Route, Ghatkesar, Hyderabad',
      zone: 'Ghatkesar',
      status: 'VERIFIED_ACTIVE',
      surplusStockCount: 18,
    },
  ],
  hospitals: [
    {
      id: 'hosp-301',
      name: 'Apollo Hospitals (Jubilee Hills)',
      regCode: 'TS-HYD-HOSP-9904',
      type: 'HOSPITAL',
      phone: '+91 40 2360 7777',
      email: 'emergency@apollohospitals.com',
      address: 'Road No. 92, Jubilee Hills, Hyderabad - 500033',
      zone: 'Jubilee Hills',
      status: 'VERIFIED_ACTIVE',
      emergencyBeds: 45,
      icuProcurement: 'Active',
    },
    {
      id: 'hosp-302',
      name: 'KIMS Hospital (Secunderabad)',
      regCode: 'TS-HYD-HOSP-7712',
      type: 'HOSPITAL',
      phone: '+91 40 4488 5000',
      email: 'trauma@kimshospitals.com',
      address: 'Minister Road, Secunderabad, Hyderabad - 500003',
      zone: 'Secunderabad',
      status: 'VERIFIED_ACTIVE',
      emergencyBeds: 60,
      icuProcurement: 'Active',
    },
    {
      id: 'hosp-303',
      name: 'Yashoda Hospitals (Malakpet)',
      regCode: 'TS-HYD-HOSP-5531',
      type: 'HOSPITAL',
      phone: '+91 40 4567 8900',
      email: 'procurement@yashodamail.com',
      address: 'Nalgonda X Roads, Malakpet, Hyderabad - 500036',
      zone: 'Malakpet',
      status: 'VERIFIED_ACTIVE',
      emergencyBeds: 30,
      icuProcurement: 'Active',
    },
    {
      id: 'hosp-304',
      name: 'Government Area Hospital (Ghatkesar Highway)',
      regCode: 'TS-HYD-HOSP-3310',
      type: 'HOSPITAL',
      phone: '+91 40 2888 1122',
      email: 'ghatkesar.areahosp@telangana.gov.in',
      address: 'ORR Junction, Ghatkesar, Medchal-Malkajgiri - 501301',
      zone: 'Ghatkesar',
      status: 'VERIFIED_ACTIVE',
      emergencyBeds: 50,
      icuProcurement: 'Active',
    },
  ],
};

// DONATIONS LIFECYCLE
export const getStoredDonations = () => {
  const data = localStorage.getItem(DONATIONS_KEY);
  if (!data) {
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(INITIAL_DONATIONS));
    return INITIAL_DONATIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(INITIAL_DONATIONS));
    return INITIAL_DONATIONS;
  }
};

export const addDonation = (newDonation) => {
  const current = getStoredDonations();
  const updated = [newDonation, ...current];
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateDonationStatus = (donationId, updates) => {
  const current = getStoredDonations();
  const updated = current.map((don) =>
    don.id === donationId ? { ...don, ...updates } : don
  );
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(updated));
  return updated;
};

// NGO MEDICINE REQUISITIONS LIFECYCLE
export const getStoredNgoRequests = () => {
  const data = localStorage.getItem(NGO_REQUESTS_KEY);
  if (!data) {
    localStorage.setItem(NGO_REQUESTS_KEY, JSON.stringify(INITIAL_NGO_REQUESTS));
    return INITIAL_NGO_REQUESTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(NGO_REQUESTS_KEY, JSON.stringify(INITIAL_NGO_REQUESTS));
    return INITIAL_NGO_REQUESTS;
  }
};

export const addNgoRequest = (newRequest) => {
  const current = getStoredNgoRequests();
  const updated = [newRequest, ...current];
  localStorage.setItem(NGO_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

export const allocateNgoRequest = (requestId, supplierInfo) => {
  const current = getStoredNgoRequests();
  const updated = current.map((req) => {
    if (req.id === requestId) {
      return {
        ...req,
        status: 'ALLOCATED',
        allocatedFrom: supplierInfo,
        allocatedAt: new Date().toISOString(),
      };
    }
    return req;
  });
  localStorage.setItem(NGO_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

// REGISTERED ENTITIES DIRECTORY
export const getStoredRegisteredEntities = () => {
  const data = localStorage.getItem(ENTITIES_KEY);
  if (!data) {
    localStorage.setItem(ENTITIES_KEY, JSON.stringify(INITIAL_ENTITIES));
    return INITIAL_ENTITIES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(ENTITIES_KEY, JSON.stringify(INITIAL_ENTITIES));
    return INITIAL_ENTITIES;
  }
};
